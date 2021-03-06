'use strict';

var localConnection;
var remoteConnection;
var sendChannel;
var receiveChannel;
var pcConstraint;
var sendButton = document.querySelector('button#sendData');
var orderedCheckbox = document.querySelector('input#ordered');
var data = document.querySelector('input#Data');
var sendProgress = document.querySelector('progress#sendProgress');
var receiveProgress = document.querySelector('progress#receiveProgress');
var errorMessage = document.querySelector('div#errorMsg');

var receivedSize = 0;
var bytesToSend = 0;

sendButton.onclick = createConnection;

// Prevent data sent to be set to 0.
data.addEventListener('change', function(e) {
  if (this.value <= 0) {
    sendButton.disabled = true;
    errorMessage.innerHTML = '<p>Please enter a number greater than zero.</p>';
  } else {
    errorMessage.innerHTML = '';
    sendButton.disabled = false;
  }
});

function createConnection() {
  sendButton.disabled = true;
  data.disabled = true;
  var servers = null;
  pcConstraint = null;
  
  //encoding the data, and getting it's length
  var m = encodeURIComponent(data.value).match(/%[89ABab]/g);
  bytesToSend = data.value.length + (m ? m.length : 0);

  trace('Sending ' + bytesToSend)

  // Add localConnection to global scope to make it visible
  // from the browser console.
  window.localConnection = localConnection = new RTCPeerConnection(servers,
      pcConstraint);
  trace('Created local peer connection object localConnection');

  var dataChannelParams = {ordered: false};
  if (orderedCheckbox.checked) {
    dataChannelParams.ordered = true;
  }

  sendChannel = localConnection.createDataChannel(
      'sendDataChannel', dataChannelParams);
  sendChannel.binaryType = 'arraybuffer';
  trace('Created send data channel');

  sendChannel.onopen = onSendChannelStateChange;
  sendChannel.onclose = onSendChannelStateChange;
  localConnection.onicecandidate = function(e) {
    onIceCandidate(localConnection, e);
  };

  localConnection.createOffer().then(
    gotDescription1,
    onCreateSessionDescriptionError
  );

  // Add remoteConnection to global scope to make it visible
  // from the browser console.
  window.remoteConnection = remoteConnection = new RTCPeerConnection(servers,
      pcConstraint);
  trace('Created remote peer connection object remoteConnection');

  remoteConnection.onicecandidate = function(e) {
    onIceCandidate(remoteConnection, e);
  };
  remoteConnection.ondatachannel = receiveChannelCallback;
}

function onCreateSessionDescriptionError(error) {
  trace('Failed to create session description: ' + error.toString());
}

function sendGeneratedData() {
  sendProgress.max = bytesToSend;
  receiveProgress.max = sendProgress.max;
  sendProgress.value = 0;
  receiveProgress.value = 0;

  var chunkSize = 16384;
  var stringToSendRepeatedly = data.value;
  var bufferFullThreshold = 5 * chunkSize;
  var usePolling = true;
  if (typeof sendChannel.bufferedAmountLowThreshold === 'number') {
    trace('Using the bufferedamountlow event for flow control');
    usePolling = false;

    // Reduce the buffer fullness threshold, since we now have more efficient
    // buffer management.
    bufferFullThreshold = chunkSize / 2;

    // This is "overcontrol": our high and low thresholds are the same.
    sendChannel.bufferedAmountLowThreshold = bufferFullThreshold;
  }
  // Listen for one bufferedamountlow event.
  var listener = function() {
    sendChannel.removeEventListener('bufferedamountlow', listener);
    sendAllData();
  };
  var sendAllData = function() {
    // Try to queue up a bunch of data and back off when the channel starts to
    // fill up. We don't setTimeout after each send since this lowers our
    // throughput quite a bit (setTimeout(fn, 0) can take hundreds of milli-
    // seconds to execute).
    while (sendProgress.value < sendProgress.max) {
      if (sendChannel.bufferedAmount > bufferFullThreshold) {
        if (usePolling) {
          setTimeout(sendAllData, 250);
        } else {
          sendChannel.addEventListener('bufferedamountlow', listener);
        }
        return;
      }
      sendProgress.value += chunkSize;
      sendChannel.send(stringToSendRepeatedly);
    }
  };
  setTimeout(sendAllData, 0);
}

function closeDataChannels() {
  trace('Closing data channels');
  sendChannel.close();
  trace('Closed data channel with label: ' + sendChannel.label);
  receiveChannel.close();
  trace('Closed data channel with label: ' + receiveChannel.label);
  localConnection.close();
  remoteConnection.close();
  localConnection = null;
  remoteConnection = null;
  trace('Closed peer connections');
}

function gotDescription1(desc) {
  localConnection.setLocalDescription(desc);
  trace('Offer from localConnection \n' + desc.sdp);
  remoteConnection.setRemoteDescription(desc);
  remoteConnection.createAnswer().then(
    gotDescription2,
    onCreateSessionDescriptionError
  );
}

function gotDescription2(desc) {
  remoteConnection.setLocalDescription(desc);
  trace('Answer from remoteConnection \n' + desc.sdp);
  localConnection.setRemoteDescription(desc);
}

function getOtherPc(pc) {
  return (pc === localConnection) ? remoteConnection : localConnection;
}

function getName(pc) {
  return (pc === localConnection) ? 'localPeerConnection' :
      'remotePeerConnection';
}

function onIceCandidate(pc, event) {
  getOtherPc(pc).addIceCandidate(event.candidate)
  .then(
    function() {
      onAddIceCandidateSuccess(pc);
    },
    function(err) {
      onAddIceCandidateError(pc, err);
    }
  );
  trace(getName(pc) + ' ICE candidate: \n' + (event.candidate ?
      event.candidate.candidate : '(null)'));
}

function onAddIceCandidateSuccess() {
  trace('AddIceCandidate success.');
}

function onAddIceCandidateError(error) {
  trace('Failed to add Ice Candidate: ' + error.toString());
}

function receiveChannelCallback(event) {
  trace('Receive Channel Callback');
  receiveChannel = event.channel;
  receiveChannel.binaryType = 'arraybuffer';
  receiveChannel.onmessage = onReceiveMessageCallback;

  receivedSize = 0;
}

function onReceiveMessageCallback(event) {
  receivedSize += event.data.length;
  receiveProgress.value = receivedSize;

  if (receivedSize === bytesToSend) {
    closeDataChannels();
    sendButton.disabled = false;
    data.disabled = false;
  }
}

function onSendChannelStateChange() {
  var readyState = sendChannel.readyState;
  trace('Send channel state is: ' + readyState);
  if (readyState === 'open') {
    sendGeneratedData();
  }
}