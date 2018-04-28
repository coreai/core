
if (significantValue >= this.value) {
    return this.significant = true
}

if (consistentValue >= this.value) {
    return this.consistent = true
}

if (strangeValue >= this.value) {
    return this.strange = true
}
