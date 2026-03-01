import { Component, signal } from '@angular/core';

@Component({
	selector: 'app-contact',
	imports: [],
	standalone: true,
	templateUrl: './contact.html',
	styleUrl: './contact.css',
})
export class ContactComponent {

	protected pressedSubmit = signal<boolean>(false);

	protected onSubmit(event: Event) {
		event.preventDefault();
		this.pressedSubmit.set(true);

		setTimeout(() => {
			this.pressedSubmit.set(false);
		}, 200);

	}

}
