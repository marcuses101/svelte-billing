type AlertType = 'success' | 'error' | 'info' | 'warning';

type ToastInfo = { alertType: AlertType; message: string; id: string };

class ToasterState {
	toasts = $state<ToastInfo[]>([]);
	currentToast = $derived(this.toasts[0]);
	timeout: NodeJS.Timeout | null;

	constructor() {
		this.toasts = [];
		this.timeout = null;
	}
	addToast(info: Pick<ToastInfo, 'alertType' | 'message'>) {
		this.toasts.push({ ...info, id: crypto.randomUUID() });
		if (this.timeout === null) {
			this.timeout = setTimeout(() => {
				this.nextToast();
			}, 3000);
		}
	}
	nextToast() {
		this.toasts.shift();
		if (this.toasts.length === 0) {
			this.timeout = null;
		} else {
			this.timeout = setTimeout(() => {
				this.nextToast();
			}, 3000);
		}
	}
}

export const toasterState = new ToasterState();

export function addToast(info: Pick<ToastInfo, 'alertType' | 'message'>) {
	console.log('adding toast', info);
	toasterState.addToast(info);
}
export function successToast(message: string) {
	toasterState.addToast({ alertType: 'success', message });
}

export function errorToast(message: string) {
	toasterState.addToast({ alertType: 'error', message });
}
