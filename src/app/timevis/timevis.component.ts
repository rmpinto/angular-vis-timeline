import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

// Declare vis library
declare const vis: any;

@Component({
	selector: 'app-timevis',
	templateUrl: './timevis.component.html',
	styleUrls: [ './timevis.component.css' ]
})
export class TimevisComponent implements OnInit, AfterViewInit {
	// Create ElementRef with ViewChild decorator as 'timeline'
	/*
  	By using @ViewChild, the timelineContainer member variable is going to be filled in by Angular with a ElementRef instance.
  	*/
	@ViewChild('timeline', { static: true }) timelineContainer: ElementRef;
	tlContainer: any;
	timeline: any;
	data: any;
	idOptions: number[] = [];
	groups: any;
	options: {};
	inputStartDate: Date;
	inputEndDate: Date;
	inputStartTime: string;
	inputEndTime: string;
	inputName: string;
	selectedItem: any;

	constructor() {
		// Initialize data, groups and options
		this.getTimelineData();
		this.getTimelineGroups();
		this.getOptions();
	}

	ngOnInit() {}

	ngAfterViewInit() {
		// Create DOM element
		this.tlContainer = this.timelineContainer.nativeElement;
		// Create instance of Timeline class within DOM element
		this.timeline = new vis.Timeline(this.tlContainer, null, this.options);
		// Set groups
		this.timeline.setGroups(this.groups);
		// Set items
		this.timeline.setItems(this.data);
	}

	private getTimelineGroups(): void {
		// Create groups
		this.groups = new vis.DataSet([
			{ id: 1, content: 'Machine1' },
			{ id: 2, content: 'Machine2' },
			{ id: 3, content: 'Machine3' },
			{ id: 4, content: 'Machine4' }
		]);
	}

	private getTimelineData(): void {
		// Create a DataSet (allows two way data-binding)
		// Create items
		this.data = new vis.DataSet();
		const count = 100;
		let sample = 1;
		let machine = 1;

		// Create 4 Workers groups, then order inside each group
		for (let j = 0; j < 4; j++) {
			const date = new Date();
			for (let i = 0; i < count / 4; i++) {
				date.setHours(date.getHours() + 4 * Math.random());
				const start = new Date(date);

				date.setHours(date.getHours() + 2 + Math.floor(Math.random() * 4));
				const end = new Date(date);

				this.data.add({
					id: sample,
					group: machine,
					start,
					end,
					content: 'Sample ' + sample
				});

				// Populate options array
				this.idOptions.push(sample);

				sample++;
			}
			machine++;
		}
	}

	private getOptions(): void {
		// specify options
		this.options = {
			stack: false,
			start: new Date(),
			end: new Date(1000 * 60 * 60 * 24 + new Date().valueOf()),
			editable: true,
			margin: {
				item: 10,
				axis: 5
			},
			orientation: 'top'
		};
	}

	public delItem(): void {
		console.log('Add item ');
		console.log('Selected item is ' + this.selectedItem);
		if (this.selectedItem) {
			// Update options
			this.idOptions.splice(this.selectedItem - 1, 1);
			// Remove item
			this.data.remove(this.selectedItem);
		}
	}

	public addItem(): void {
		console.log('Add item ');
		console.log('Start date is ' + this.inputStartDate);
		console.log('End date is ' + this.inputEndDate);
		if (this.inputEndDate && this.inputStartDate && this.inputName) {
			const newId: number = this.idOptions.length + 1;
			this.data.add({
				id: newId,
				group: 1,
				start: new Date(this.inputStartDate),
				end: new Date(this.inputEndDate),
				content: 'Sample ' + newId + ': ' + this.inputName
			});
			// Update options
			this.idOptions.push(newId);
			// Set items
			this.timeline.setItems(this.data);
		}
	}

	public fitRange(): void {
		console.log('Fitting timeline');
		this.timeline.fit('linear');
	}

	public focusItem(): void {
		console.log('Focus on item with id 7');
		// Focus and select item
		this.timeline.focus('7');
		this.timeline.setSelection('7');
	}

	public setWindow(): void {
		console.log('Setting range window');
		const startWindow = new Date(+Object.values(this.options)[1].valueOf() + 60 * 60 * 4 * 1000);
		const endWindow = new Date(+Object.values(this.options)[2].valueOf() - 60 * 60 * 4 * 1000);
		this.timeline.setWindow(startWindow, endWindow);
	}

	public centerView(): void {
		console.log('Centering on specific time');
		const duration = +Object.values(this.options)[2].valueOf() - +Object.values(this.options)[1].valueOf();
		const centerDate = new Date(+Object.values(this.options)[2].valueOf() + Math.round(duration / 2));
		this.timeline.moveTo(centerDate);
	}
}
