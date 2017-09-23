var util = {};

/**
 * @param ms
 * @return string a formatted string mm:ss
 */
util.formatTime = function(ms) {
    var minutes = Math.floor(ms / Phaser.Timer.MINUTE);
    var seconds = Math.trunc((ms - (minutes * Phaser.Timer.MINUTE)) / Phaser.Timer.SECOND);

    var minutesStr = minutes.toString();
    if (minutes < 10) {
        minutesStr = '0' + minutesStr;
    }
    var secondsStr = seconds.toString();
    if (seconds < 10) {
        secondsStr = '0' + secondsStr;
    }
    return minutesStr + ':' + secondsStr;
};