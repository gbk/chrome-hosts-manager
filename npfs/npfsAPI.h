/**********************************************************\

  Auto-generated npfsAPI.h

\**********************************************************/

#include <string>
#include <sstream>
#include <boost/weak_ptr.hpp>
#include "JSAPIAuto.h"
#include "BrowserHost.h"
#include "npfs.h"

#ifndef H_npfsAPI
#define H_npfsAPI

// A set of macros to use for platform detection.
#if defined(__APPLE__)
#define OS_MACOSX 1
#elif defined(__linux__)
#define OS_LINUX 1
#elif defined(_WIN32)
#define OS_WIN 1
#else
#error Please add support for your platform in build/build_config.h
#endif

// For access to standard POSIX features, use OS_POSIX instead of a more
// specific macro.
#if defined(OS_MACOSX) || defined(OS_LINUX)
#define OS_POSIX 1
#endif

#if defined(OS_POSIX)
#define PLATFORM_PATH_SEPARATOR_CHAR '/'
#elif defined(OS_WIN)
#define PLATFORM_PATH_SEPARATOR_CHAR '\\'
#endif

class npfsAPI : public FB::JSAPIAuto
{
public:
    ////////////////////////////////////////////////////////////////////////////
    /// @fn npfsAPI::npfsAPI(const npfsPtr& plugin, const FB::BrowserHostPtr host)
    ///
    /// @brief  Constructor for your JSAPI object.
    ///         You should register your methods, properties, and events
    ///         that should be accessible to Javascript from here.
    ///
    /// @see FB::JSAPIAuto::registerMethod
    /// @see FB::JSAPIAuto::registerProperty
    /// @see FB::JSAPIAuto::registerEvent
    ////////////////////////////////////////////////////////////////////////////
    npfsAPI(const npfsPtr& plugin, const FB::BrowserHostPtr& host) :
        m_plugin(plugin), m_host(host)
    {
        registerMethod("getPlatform", make_method(this, &npfsAPI::getPlatform));
        registerMethod("getSystemPath", make_method(this, &npfsAPI::getSystemPath));
        registerMethod("saveTextFile", make_method(this, &npfsAPI::saveTextFile));
        registerMethod("getTextFile", make_method(this, &npfsAPI::getTextFile));
        registerMethod("fileExists", make_method(this, &npfsAPI::fileExists));
        registerMethod("isDirectory", make_method(this, &npfsAPI::isDirectory));
    }

    ///////////////////////////////////////////////////////////////////////////////
    /// @fn npfsAPI::~npfsAPI()
    ///
    /// @brief  Destructor.  Remember that this object will not be released until
    ///         the browser is done with it; this will almost definitely be after
    ///         the plugin is released.
    ///////////////////////////////////////////////////////////////////////////////
    virtual ~npfsAPI() {};

    // Method
    std::string getPlatform();
    std::string getSystemPath();
    bool saveTextFile(const std::string& path, const std::string& file);
    std::string getTextFile(const std::string& path);
    bool fileExists(const std::string& path);
    bool isDirectory(const std::string& path);

    npfsPtr getPlugin();

private:
    npfsWeakPtr m_plugin;
    FB::BrowserHostPtr m_host;
};

#endif // H_npfsAPI

