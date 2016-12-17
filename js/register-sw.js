navigator.serviceWorker.register('/service-worker.js').then(function(reg) {
  if (reg.waiting) {
    promptForUpdate(reg.waiting);
    return;
  }

  if (reg.installing) {
    trackInstalling(reg.installing);
    return;
  }

  reg.addEventListener('updatefound', function() {
    trackInstalling(reg.installing);
  });
})


function trackInstalling(worker) {
  worker.addEventListener('statechange', function() {
    if (worker.state == 'installed') {
      promptForUpdate(worker);
    }
  });
}

function promptForUpdate(worker) {
  if(window.confirm('An update is available')) {
    worker.postMessage({action: 'skipWaiting'});
  }
}
