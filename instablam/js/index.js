if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("./sw.js")
    .then(() => console.log("registered serviceworker"))
    .catch((error) => console.log("error with register service worker", error));
}
