declare var __root__: any
import { event } from '../listener'
import * as viewManage from '../viewManage'

function getRoutes() {
  const root = __root__
  const path = location.hash.replace(/^#!/, '')
  if (sessionStorage == null) return path ? [path] : [root]
  const str = sessionStorage.getItem('routes')
  if (!str) return path ? [path] : [root]
  const routes = str.split('|')
  if (routes.indexOf(path) !== routes.length - 1) {
    return path ? [path] : [root]
  }
  return routes
}

export function APP_SERVICE_COMPLETE(data) {
  event.emit('APP_SERVICE_COMPLETE')
  const routes = getRoutes()
  const firstPage = routes.shift()
  viewManage.navigateTo(firstPage)
}

export function getPublicLibVersion() {}

export function systemLog() {}

export function showShareMenu() {}

export function switchTab(data) {}

export function shareAppMessage(data) {}

export function requestPayment(data) {}

export function previewImage(data) {}

export function stopPullDownRefresh(data) {}

export function publish(data) {}

export function scanCode(data) {}

export function redirectTo(data) {}

export function navigateTo(data) {}

export function navigateBack(data) {}

export function PULLDOWN_REFRESH(data) {}

export function WEBVIEW_READY(data) {}

export function GET_APP_DATA(data) {}

export function WRITE_APP_DATA(data) {}

export function GET_APP_STORAGE(data) {}

export function DELETE_APP_STORAGE(data) {}

export function SET_APP_STORAGE(data) {}

export function send_app_data(data) {}

export function setNavigationBarTitle(data) {}

export function showNavigationBarLoading() {}

export function hideNavigationBarLoading() {}

export function chooseImage(data) {}

export function chooseVideo(data) {}

export function saveFile(data) {}

export function enableCompass() {}

export function enableAccelerometer() {}

export function getNetworkType(data) {}

export function getLocation(data) {}

export function openLocation(data) {}

export function chooseLocation(data) {}

export function setStorage(data) {}

export function getStorage(data) {}

export function clearStorage(data) {}

export function startRecord(data) {}

export function stopRecord() {}

export function playVoice(data) {}

export function pauseVoice() {}

export function stopVoice() {}

export function getMusicPlayerState(data) {}

export function operateMusicPlayer(data) {}

export function uploadFile(data) {}

export function downloadFile(data) {}

export function getSavedFileList(data) {}

export function removeSavedFile(data) {}

export function getSavedFileInfo(data) {}

export function openDocument(data) {}

export function getStorageInfo(data) {}

export function removeStorage(data) {}

export function showToast(data) {}

export function hideToast(data) {}

export function showModal(data) {}

export function showActionSheet(data) {}

export function getImageInfo(data) {}

export function base64ToTempFilePath(data) {}

export function refreshSession(data) {}

export function showPickerView(data, args) {}

export function showDatePickerView(data, args) {}

function requiredArgs(keys, data) {}

function onError(data, message) {}

function onSuccess(data, extra = {}) {}

function onCancel(data, extra = {}) {}

function publishPagEevent(eventName, extra) {}

