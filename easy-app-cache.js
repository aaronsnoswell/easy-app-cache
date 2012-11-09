/** easyAppCache.js
 * Client-side caching for the mobile app masses
 */

var appCache;

;(function(global) {
    var ac = function() {};

    ac.log = false;
    ac.pengine = "localstorage";
    ac.mengine = "global";
    ac.sengine = "pg_pause";

    var cl = function() {
        if(ac.log) console.log.apply(console, arguments);
    }

    /** appCache.setP(key, value)
     * Stores the given value in persitant storage
     */
    ac.prototype.setP = function(key, value) {
        if(typeof(key) != "string") {
            cl("Error (appCache.setP) - key must be a string.");
            return;
        }

        if(ac.pengine == "localstorage") {
            if(global.localStorage) {
                try {
                    global.localStorage.setItem(key, global.JSON.stringify(value));
                } catch (e) {
                    // For some reason we couldn't save the value :(
                    cl("Error (appCache.setP) - unable to save to localStorage.", key, value, e);
                    return;
                }
            } else {
                cl("Error (appCache.setP) - localStorage not supported.");
                return;
            }
        } else {
            cl("Error (appCache.setP - unkown or unimplemented storage engine '" + ac.pengine + "'.");
            return;
        }
    }

    /** appCache.getP(key, def)
     * Retrieves the given value from persitant storage, returning def
     * in the event that no value was previously stored.
     */
    ac.prototype.getP = function(key, def) {
        if(typeof(key) != "string") {
            cl("Error (appCache.getP) - key must be a string.");
            return;
        }

        def = (typeof(def) == "undefined") ? undefined : def;

        if(ac.pengine == "localstorage") {
            if(global.localStorage) {
                var value = global.localStorage.getItem(key);

                if((value == null) || (value == "undefined")) {
                    // Unable to read the value. Save it for next time though
                    cl("Warning (appCache.getP) - unable to read value, returning default.");
                    global.localStorage.setItem(key, global.JSON.stringify(def));
                    
                    value = def;
                } else {
                    // Attempt to cast the value intelligently
                    value = global.JSON.parse(value);
                }
                
                return value;
            } else {
                cl("Error (appCache.getP) - localStorage not supported, returning default.");
                return def;
            }
        } else {
            cl("Error (appCache.getP - unkown or unimplemented storage engine '" + ac.pengine + "', returning default.");
            return def;
        }
    }

    /** appCache.clearP(key)
     * Clears the given value from persitant storage
     */
    ac.prototype.clearP = function(key) {
        if(typeof(key) == "undefined") {
            cl("Info (appCache.clearP) - clearing all persistant storage items.");
            key = -1;
        } else if(typeof(key) != "string") {
            cl("Error (appCache.clearP) - key must be a string.");
            return;
        }

        if(ac.pengine == "localstorage") {
            if(global.localStorage) {
                try {
                    if(key == -1) {
                        // Clear all items
                        global.localStorage.clear();
                    } else {
                        // Clear an item
                        global.localStorage.removeItem(key, value);
                    }
                } catch (e) {
                    if(key == -1) cl("Error (appCache.clearP) - unable to clear items from localStorage.", e);
                    else cl("Error (appCache.clearP) - unable to clear item from localStorage.", key, e);
                    return;
                }
            } else {
                cl("Error (appCache.clearP) - localStorage not supported.");
                return;
            }
        } else {
            cl("Error (appCache.clearP - unkown or unimplemented storage engine '" + ac.pengine + "'.");
            return;
        }
    }
    
    /** appCache.setM(key, value)
     * Stores the given value in memory storage
     */
    ac.prototype.setM = function(key, value) {
        if(typeof(key) != "string") {
            cl("Error (appCache.setM) - key must be a string.");
            return;
        }

        if(ac.mengine == "global") {
            // Initialise global storage
            ac.globalstorage = ac.globalstorage || {};

            ac.globalstorage[key] = value;
        } else {
            cl("Error (appCache.setM - unkown or unimplemented storage engine '" + ac.mengine + "'.");
            return;
        }
    }

    ac.prototype.getM = function(key, def) {
        if(typeof(key) != "string") {
            cl("Error (appCache.getM) - key must be a string.");
            return;
        }

        def = (typeof(def) == "undefined") ? undefined : def;

        if(ac.mengine == "global") {
            // Initialise global storage
            ac.globalstorage = ac.globalstorage || {};

            var value = ac.globalstorage[key];
            
            if(typeof(value) == "undefined") {
                cl("Warning (appCache.getM) - unable to read value, returning default.");
                value = def;

                // Store the default for next time
                ac.globalstorage[key] = def;
            }

            return value;
        } else {
            cl("Error (appCache.getM - unkown or unimplemented storage engine '" + ac.mengine + "', returning default.");
            return def;
        }
    }

    ac.prototype.clearM = function(key) {
        if(typeof(key) == "undefined") {
            cl("Info (appCache.clearM) - clearing all memory storage items.");
            key = -1;
        } else if(typeof(key) != "string") {
            cl("Error (appCache.clearM) - key must be a string.");
            return;
        }

        if(ac.mengine == "global") {
            // Initialise global storage
            ac.globalstorage = ac.globalstorage || {};

            if(key == -1) {
                // Clear all items
                ac.globalstorage = {};
            } else {
                // Clear an item
                delete ac.globalstorage[key];
            }
        } else {
            cl("Error (appCache.clearM - unkown or unimplemented storage engine '" + ac.mengine + "'.");
            return;
        }
    }

    
    /** appCache.setS(key, value)
     * Stores the given value in session storage
     */
    ac.prototype.setS = function(key, value) {
        if(typeof(key) != "string") {
            cl("Error (appCache.setS) - key must be a string.");
            return;
        }

        if(ac.sengine == "beforeunload" || ac.sengine == "pg_pause") {
            // Initialise session storage
            ac.sessionstorage = ac.sessionstorage || {};

            ac.sessionstorage[key] = value;
        } else {
            cl("Error (appCache.setS - unkown or unimplemented storage engine '" + ac.sengine + "'.");
            return;
        }
    }

    ac.prototype.getS = function(key, def) {
        if(typeof(key) != "string") {
            cl("Error (appCache.getS) - key must be a string.");
            return;
        }

        def = (typeof(def) == "undefined") ? undefined : def;

        if(ac.sengine == "beforeunload" || ac.sengine == "pg_pause") {
            // Initialise session storage
            ac.sessionstorage = ac.sessionstorage || {};

            var value = ac.sessionstorage[key];
            
            if(typeof(value) == "undefined") {
                cl("Warning (appCache.getS) - unable to read value, returning default.");
                value = def;
                
                // Store the default for next time
                ac.sessionstorage[key] = def;
            }

            return value;
        } else {
            cl("Error (appCache.getS - unkown or unimplemented storage engine '" + ac.sengine + "', returning default.");
            return def;
        }
    }

    ac.prototype.clearS = function(key) {
        if(typeof(key) == "undefined") {
            cl("Info (appCache.clearS) - clearing all session storage items.");
            key = -1;
        } else if(typeof(key) != "string") {
            cl("Error (appCache.clearS) - key must be a string.");
            return;
        }

        if(ac.sengine == "beforeunload" || ac.sengine == "pg_pause") {
            // Initialise session storage
            ac.sessionstorage = ac.sessionstorage || {};

            if(key == -1) {
                // Clear all items
                ac.sessionstorage = {};
            } else {
                // Clear an item
                delete ac.sessionstorage[key];
            }
        } else {
            cl("Error (appCache.clearS - unkown or unimplemented storage engine '" + ac.sengine + "'.");
            return;
        }
    }

    // Configuration functions

    /** appCache.setLog(log)
     * Enable or disable logging
     */
    ac.prototype.setVerbose = function(log) {
        if(typeof(log) != "boolean") {
            cl("Error (appCache.setVerbose) - log must be a boolean.");
            return;
        }
        ac.log = log;
    }

    /** appCache.setPEngine(eng)
     * Set the engine used for persistant storage.
     * Possible values are "localstorage", "webdb" or "filesystem"
     */
    ac.prototype.setPEngine = function(eng) {
        if(typeof(eng) != "string") {
            cl("Error (appCache.setPEngine) - eng must be a string.");
            return;
        }
        ac.pengine = eng;
    }

    /** appCache.setMEngine(eng)
     * Set the engine used for memory storage.
     * Possible values are "global"
     */
    ac.prototype.setMEngine = function(eng) {
        if(typeof(eng) != "string") {
            cl("Error (appCache.setMEngine) - eng must be a string.");
            return;
        }
        ac.mengine = eng;
    }

    /** appCache.setSEngine(eng)
     * Set the engine used for session storage.
     * Possible values are "pg_pause"
     */
    ac.prototype.setSEngine = function(eng) {
        if(typeof(eng) != "string") {
            cl("Error (appCache.setSEngine) - eng must be a string.");
            return;
        }
        ac.sengine = eng;

        // If using the phonegap engine, add an onpause callback to clear the
        // session-level storage
        if(ac.sengine == "pg_pause") {
            document.addEventListener("pause", function() {
                cl("Info (appCache.setSEngine) - clearing session storage.")
                ac.sessionstorage = {};
                delete ac.sessionstorage;
            }, false);
        }
    }


    /** appCache.bust()
     * Bust the cache, clearing everything
     */
    ac.prototype.bust = function() {
        appCache.clearP();
        appCache.clearM();
        appCache.clearS();
    }

    // Initialise the global appCache instance
    appCache = new ac();

})(window);



