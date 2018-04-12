/* plus ready */

function onPlusReady(): void{
  // 修改UserAgent
  const UA: string = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.146 Safari/537.36';
  plus.navigator.setUserAgent(UA);
}

document.addEventListener('plusready', onPlusReady, false);