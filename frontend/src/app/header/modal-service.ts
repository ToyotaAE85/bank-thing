import { Injectable, signal } from '@angular/core';

@Injectable()
export class ModalService {

	public isModalOpen = signal<boolean>(false);
	public modalTabType = signal<string>('login');

	public setModalOpenTo(input: boolean) {
		this.isModalOpen.set(input);
	}

	public setModalTypeTo(input: string) {
		this.modalTabType.set(input);
	}
};
