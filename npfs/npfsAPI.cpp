/**********************************************************\

  Auto-generated npfsAPI.cpp

\**********************************************************/

#include "JSObject.h"
#include "variant_list.h"
#include "DOM/Document.h"
#include "global/config.h"

#include "npfsAPI.h"

#if defined(OS_WIN)
#include <io.h>
#include <windows.h>
#else
#include <dirent.h>
#endif
#include <stdio.h>
#include <sys/stat.h>

const char* dropTrailingSlash(const char *filenameWithTrailingSlash)
{
    char *filenameWithoutTrailingSlash = new char[strlen(filenameWithTrailingSlash) + 1];
    strcpy(filenameWithoutTrailingSlash, filenameWithTrailingSlash);
    for (int i = strlen(filenameWithoutTrailingSlash) - 1; i >= 0; --i) {
        if (filenameWithoutTrailingSlash[i] == PLATFORM_PATH_SEPARATOR_CHAR) {
            filenameWithoutTrailingSlash[i] = '\0';
        } else {
            break;
        }
    }
    return filenameWithoutTrailingSlash;
}

std::string npfsAPI::getPlatform()
{
#if defined(OS_WIN)
    return "windows";
#elif defined(OS_LINUX)
    return "linux";
#elif defined(OS_MACOSX)
    return "osx";
#endif
}

std::string npfsAPI::getSystemPath()
{
#if defined(OS_WIN)
    // FIXME Why it always fails here ? Can anybody help me ...
    char *value = NULL;
    size_t len = GetSystemDirectoryA(value, FILENAME_MAX);
    std::string result(value, len);
    delete[] value;
    return result;
#endif
    return "";
}

bool npfsAPI::saveTextFile(const std::string& path, const std::string& data)
{
    FILE *file = fopen(path.c_str(), "wb");
    if (!file) {
      return false;
    }

    size_t len = data.size();
    size_t written = fwrite(data.c_str(), 1, len, file);
    fclose(file);

    return (written == len);
}

std::string npfsAPI::getTextFile(const std::string& path)
{
    FILE *file = fopen(path.c_str(), "r");
    if (!file) {
      return "";
    }

    fseek(file, 0, SEEK_END);
    size_t fileLength = ftell(file);
    rewind(file);

    char *value = new char[fileLength + 1];
    size_t len = fread(value, 1, fileLength, file);
    fclose(file);

    std::string result(value, len);
    delete[] value;
    return result;
}

bool npfsAPI::fileExists(const std::string& path)
{
    const char *filenameWithoutTailingSlash = dropTrailingSlash(path.c_str());
    struct stat s;
    bool fileExists = stat(filenameWithoutTailingSlash, &s) == 0;
    delete[] filenameWithoutTailingSlash;
    return fileExists;
}

bool npfsAPI::isDirectory(const std::string& path)
{
    const char *filenameWithoutTailingSlash = dropTrailingSlash(path.c_str());
    struct stat s;
    bool isDirectory = stat(filenameWithoutTailingSlash, &s) == 0 && (s.st_mode & S_IFDIR);
    delete[] filenameWithoutTailingSlash;
    return isDirectory;
}

///////////////////////////////////////////////////////////////////////////////
/// @fn npfsPtr npfsAPI::getPlugin()
///
/// @brief  Gets a reference to the plugin that was passed in when the object
///         was created.  If the plugin has already been released then this
///         will throw a FB::script_error that will be translated into a
///         javascript exception in the page.
///////////////////////////////////////////////////////////////////////////////
npfsPtr npfsAPI::getPlugin()
{
    npfsPtr plugin(m_plugin.lock());
    if (!plugin) {
        throw FB::script_error("The plugin is invalid");
    }
    return plugin;
}
