
// Based on mixure of:
// - https://gist.github.com/Johnz86/afa34e519c2f169a1bb0ddba1fe419cf
// - https://programmer.ink/think/learn-typescript-in-practice-implement-full-screen-browser-100-lines.html

export function openFullscreen() {
    var elem = document.documentElement;
    if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.mozRequestFullScreen) {
        /* Firefox */
        elem.mozRequestFullScreen();
      } else if (elem.webkitRequestFullscreen) {
        /* Chrome, Safari and Opera */
        elem.webkitRequestFullscreen();

      } else if (elem.msRequestFullscreen) {
        /* IE/Edge */
        elem.msRequestFullscreen();
      }
} 

export function closeFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.mozCancelFullScreen) { 
        /* Firefox */
        document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) { 
        /* Chrome, Safari and Opera */
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
        /* IE/Edge */
        document.msExitFullscreen();
    }
} 

export function isFullScreen(): boolean {
    return !!(document.fullscreenElement ||
        document.mozFullScreenElement ||
        document.webkitFullscreenElement ||
        document.msFullscreenElement);
}

export function toggleFullScreen(): void {
    if (isFullScreen()) {
        closeFullscreen();
    } else {
        openFullscreen();
    }
}
