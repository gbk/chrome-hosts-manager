#/**********************************************************\ 
#
# Auto-Generated Plugin Configuration file
# for npfs
#
#\**********************************************************/

set(PLUGIN_NAME "npfs")
set(PLUGIN_PREFIX "NPFS")
set(COMPANY_NAME "Alibaba")

# ActiveX constants:
set(FBTYPELIB_NAME npfsLib)
set(FBTYPELIB_DESC "npfs 1.0 Type Library")
set(IFBControl_DESC "npfs Control Interface")
set(FBControl_DESC "npfs Control Class")
set(IFBComJavascriptObject_DESC "npfs IComJavascriptObject Interface")
set(FBComJavascriptObject_DESC "npfs ComJavascriptObject Class")
set(IFBComEventSource_DESC "npfs IFBComEventSource Interface")
set(AXVERSION_NUM "1")

# NOTE: THESE GUIDS *MUST* BE UNIQUE TO YOUR PLUGIN/ACTIVEX CONTROL!  YES, ALL OF THEM!
set(FBTYPELIB_GUID 7410e22f-7f5e-53ab-84be-8ea8582697d1)
set(IFBControl_GUID d652aa56-196b-5836-b3df-5a8e113e343d)
set(FBControl_GUID 42fc3885-d130-5db0-a495-4e12f6f8b51f)
set(IFBComJavascriptObject_GUID 21887d62-137d-5c4b-ac02-db22ba4272bc)
set(FBComJavascriptObject_GUID 0b48c47f-2984-536e-9cfc-71935bf3d016)
set(IFBComEventSource_GUID b92d297b-7582-59a8-9d4c-f617847e1e72)
if ( FB_PLATFORM_ARCH_32 )
    set(FBControl_WixUpgradeCode_GUID 7ac3b2fe-5a15-5dd5-868a-c710eca3d7fd)
else ( FB_PLATFORM_ARCH_32 )
    set(FBControl_WixUpgradeCode_GUID f6daf7de-a947-5c38-95d6-01f879eb0fd2)
endif ( FB_PLATFORM_ARCH_32 )

# these are the pieces that are relevant to using it from Javascript
set(ACTIVEX_PROGID "Alibaba.npfs")
if ( FB_PLATFORM_ARCH_32 )
    set(MOZILLA_PLUGINID "alibaba.com/npfs")  # No 32bit postfix to maintain backward compatability.
else ( FB_PLATFORM_ARCH_32 )
    set(MOZILLA_PLUGINID "alibaba.com/npfs_${FB_PLATFORM_ARCH_NAME}")
endif ( FB_PLATFORM_ARCH_32 )

# strings
set(FBSTRING_CompanyName "Alibaba")
set(FBSTRING_PluginDescription "file system api for browsers")
set(FBSTRING_PLUGIN_VERSION "1.0.0.0")
set(FBSTRING_LegalCopyright "Copyright 2013 Alibaba")
set(FBSTRING_PluginFileName "np${PLUGIN_NAME}")
set(FBSTRING_ProductName "npfs")
set(FBSTRING_FileExtents "")
if ( FB_PLATFORM_ARCH_32 )
    set(FBSTRING_PluginName "npfs")  # No 32bit postfix to maintain backward compatability.
else ( FB_PLATFORM_ARCH_32 )
    set(FBSTRING_PluginName "npfs_${FB_PLATFORM_ARCH_NAME}")
endif ( FB_PLATFORM_ARCH_32 )
set(FBSTRING_MIMEType "application/x-npfs")

# Uncomment this next line if you're not planning on your plugin doing
# any drawing:

set (FB_GUI_DISABLED 1)

# Mac plugin settings. If your plugin does not draw, set these all to 0
set(FBMAC_USE_QUICKDRAW 0)
set(FBMAC_USE_CARBON 0)
set(FBMAC_USE_COCOA 0)
set(FBMAC_USE_COREGRAPHICS 0)
set(FBMAC_USE_COREANIMATION 0)
set(FBMAC_USE_INVALIDATINGCOREANIMATION 0)

# If you want to register per-machine on Windows, uncomment this line
#set (FB_ATLREG_MACHINEWIDE 1)
