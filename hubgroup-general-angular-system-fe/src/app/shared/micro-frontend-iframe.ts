class MicroFrontendIframe<T> {
	constructor() {
	}

	private listenerEvents: any[] = [];

	private listenEvent(target: any, eventName: string, callback: (event: any) => (boolean | void)): any {
		const func = (e: any) => {
			callback(e);
		};
		target.addEventListener(eventName, func);
		return () => {
			target.removeEventListener(eventName, func);
		};
	}

	public windowListenEventPostMessage(callbackFunc: (event: MessageEvent<T>) => void) {
		// const listen = this.renderer2.listen(window, 'message', callbackFunc);
		const listen = this.listenEvent(window, 'message', callbackFunc);
		this.listenerEvents.push(listen);
	}

	onPostMessageFromPageToIframe(iframeElement: HTMLIFrameElement, data: T) {
		if (iframeElement && iframeElement.contentWindow) {
			iframeElement.contentWindow.postMessage(data, '*');
		}
	}

	onPostMessageFromIframeToPage(data: T) {
		window.parent.postMessage(data, '*');
	}

	public clearListenEvent() {
		this.listenerEvents.forEach(fn => fn());
	}
}

export default MicroFrontendIframe;
