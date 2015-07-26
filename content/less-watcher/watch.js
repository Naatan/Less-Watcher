(function() {

    const {koLess} = Cu.import("chrome://komodo/content/library/less.js", {});
    var manifestLoader = Cc["@activestate.com/koManifestLoader;1"]
                            .getService(Ci.koIManifestLoader);
    var log = ko.logging.getLogger('koUtils');
    //log.setLevel(10); //debug

    if (window.navigator.platform.toLowerCase().indexOf("linux") != -1)
    {
        manifestLoader.loadManifest("chrome://ko-utils/content/less-watcher/linux/chrome.manifest", true);
    }
    else if (window.navigator.platform.toLowerCase().indexOf("macintel") != -1)
    {
        manifestLoader.loadManifest("chrome://ko-utils/content/less-watcher/mac/chrome.manifest", true);
    }
    else if (window.navigator.platform.toLowerCase().indexOf("win32") != -1)
    {
        manifestLoader.loadManifest("chrome://ko-utils/content/less-watcher/windows/chrome.manifest", true);
    }
    else
    {
        throw exception("Unsupported platform: " + window.navigator.platform);
    }

    manifestLoader.loadManifest("chrome://ko-utils/content/less-watcher/chrome.manifest", true);

    var watch = function(sheetHref)
    {
        try
        {
        koLess.localCache.resolveYoungestChild = {};
        var cacheFile = koLess.cache.getFile(sheetHref);
        var youngest = koLess.resolveYoungestChild(sheetHref);

        log.debug(cacheFile.path + "::" + cacheFile.lastModifiedTime);
        log.debug(youngest.file.path + "::" + youngest.file.lastModifiedTime);

        if ( ! cacheFile || youngest.file.lastModifiedTime > cacheFile.lastModifiedTime)
        {
            log.warn("File change detected");
            koLess.reload(true);
        }
        } catch (e)
        {
            koLess.reload(true);
            log.exception(e);
        }

        setTimeout(watch.bind(this, sheetHref), 500);
    };

    watch("chrome://komodo/skin/platform.less");

})();
