
Date.prototype.addDays = function (days) {
    const currentDate = new Date(this.valueOf());
    currentDate.setDate(currentDate.getDate() + days);
    return currentDate;
}

Date.prototype.subDays = function(days) {
    const currentDate = new Date(this.valueOf());
    currentDate.setDate(currentDate.getDate() - days);
    return currentDate;
}