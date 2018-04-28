Impact is generated through the network reaching consensus. 

Each node in the network determines the validity of a vote by determining the threshold of acceptance.

The acceptance threshold is determined by proof of consistency.

Each vote is weighted, starting at one.
If a node sends multiple votes.
Each vote is counted by half the weight of the previous vote.
If a node stops voting their vote weight climbs back to one over time


put votes in keystore with impact
a vote is impact, 
the only way to "reset" vote weight is to delete all impact you created from voting!


-- Watcher --
this activity is strange...
this activity is significant...
this activity is consistent...


-- Node profile --
generate hash
    node id
        ip address
        mac address
    total time alive
    total impact
    number of verifications
    number of rejections
    number of votes sent
    number of verified votes
    number of verified nodes
    list of contributions created
        impact of each
    list of contributions voted for
        vote weight foreach

-- Proof of Identity -- 
each node is verifying the identity of other nodes
get node profile
check blacklist
check my copy vs your copy
check if copies match


-- Proof of Vote --
One vote generated
verify my vote
    check block structure
    check keystore
    get weight
    set weight
verify someone else's vote
    get their identity
    if valid identity
    check vote validity
    if valid
    send verification to network
send my vote to network
another node verifies your vote
    updates your profile
receive verification
store vote in contribution keystore


-- Threshold for acceptance -- 
A vote is accepted when...
The vote is valid
    The Voter is identified
    It follows the correct structure
    


-- To game this system --
create contribution
setup a ton of nodes
each node votes for contribution
stop a node when it's vote weight drops to negligible
move node profile
spoof mac
spoof ip
restart node
generate new node profile
start voting
rinse and repeat
generate infinite impact for a single contribution




Gamification is always possible...
We make it hard to happen, but we can't stop it...
Instead, we create a system that can recognize when it is happening.

To do this...
We assume that most nodes are not trying to game the system, this will make it easy to identify nodes that are gaming the system...

We use a Proof of Identity algorithm based on benfords law.

Before a node can vote it must verify the identity of two other nodes.
