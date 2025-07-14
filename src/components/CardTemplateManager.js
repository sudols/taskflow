/**
 * CardTemplateManager - Handles HTML template generation for task cards
 */
export default class CardTemplateManager {
	/**
	 * Creates HTML template for a new task card (editing mode)
	 */
	static createNewCardTemplate() {
		return `
			<div class="flex items-center gap-4 bg-task-card-bg p-4 rounded-lg newCardContainer">
				<div>
					<label class="flex items-center justify-center cursor-pointer relative">
						<input
							type="checkbox"
							class="peer h-5 w-5 cursor-pointer appearance-none rounded border bg-sort-btn-bg border-checkbox-border checked:bg-checkbox-checked checked:border-0 transition"
						/>
						<span class="absolute text-checkbox-icon opacity-0 peer-checked:opacity-100 transition">
							<i class="ti ti-check"></i>
						</span>
					</label>
				</div>
				<div class="w-full flex flex-col gap-2">
					<div>
						<div class="flex items-center justify-between">
							<input
								type="text"
								name="newTaskTitle"
								id="newTaskTitle"
								placeholder="Title"
								class="outline-none text-heading text-lg font-semibold w-full"
							/>
							<button type="button" class="cursor-pointer hover:bg-generic-btn-hover hover:rounded hidden threeDotMenu transition">
								<i class="ti ti-dots-vertical"></i>
							</button>
						</div>
						<input
							type="text"
							name="newTaskDescription"
							id="newTaskDescription"
							class="outline-none text-body text-sm line-clamp-2"
							placeholder="details"
						/>
					</div>
					<div>
						<p class="text-body text-xs flex items-center gap-2">
							<span class="dueDateContainer"> 
								<button class="cursor-pointer hover:bg-generic-btn-hover rounded-sm p-1 pr-2 pl-2 border border-transparent dueToday transition" type="button">Today</button>
								<button class="cursor-pointer hover:bg-generic-btn-hover rounded-sm p-1 pr-2 pl-2 border border-transparent dueTomorrow transition" type="button">Tomorrow</button>
								<button class="cursor-pointer hover:bg-generic-btn-hover rounded-sm p-1 pr-2 pl-2 border border-transparent dueCustomDate transition" type="button"><i class="ti ti-calendar-event"></i></button>
							</span>
						</p>
					</div>
				</div>
			</div>`;
	}

	/**
	 * Creates HTML template for a display task card (view mode)
	 */
	static createDisplayCardTemplate(noteInstance) {
		return `
			<div class="flex items-center gap-4 bg-task-card-bg p-4 rounded-lg taskCard transition" data-note-id="${
				noteInstance.id
			}">
				<div>
					<label class="flex items-center justify-center cursor-pointer relative">
						<input
							type="checkbox"
							class="peer h-5 w-5 cursor-pointer appearance-none rounded border bg-sort-btn-bg border-checkbox-border checked:bg-checkbox-checked checked:border-0 transition"
						/>
						<span class="absolute text-checkbox-icon opacity-0 peer-checked:opacity-100 transition">
							<i class="ti ti-check"></i>
						</span>
					</label>
				</div>
				<div class="w-full flex flex-col gap-2">
					<div class="flex items-center justify-between titleContainer ${
						noteInstance.title ? 'visible' : 'hidden'
					}">
						<input
							type="text"
							name="newTaskTitle"
							id="newTaskTitle"
							placeholder="Title"
							value="${noteInstance.title || ''}"
							class="outline-none text-heading text-lg font-semibold w-full"
						/>
						<button type="button" class="cursor-pointer hover:bg-generic-btn-hover hover:rounded hidden threeDotMenu transition">
							<i class="ti ti-dots-vertical"></i>
						</button>
					</div>
					<div class="descriptionContainer ${
						noteInstance.description ? 'visible' : 'hidden'
					} flex flex-col w-full">
						<input
							type="text"
							name="newTaskDescription"
							id="newTaskDescription"
							class="outline-none text-body text-sm line-clamp-2"
							placeholder="details"
							value="${noteInstance.description || ''}"
						/>
					</div>
					<div class="dueDateParentContainer ${
						noteInstance.dueDate !== '' ? 'visible' : 'hidden'
					}">
						<p class="text-body text-xs flex items-center gap-2 dueDateContainer">
							<button class="cursor-pointer hover:bg-generic-btn-hover rounded-sm p-1 pr-2 pl-2 border border-transparent dueCustomDate transition" type="button">${
								noteInstance.dueDate === ''
									? '<i class="ti ti-calendar-event"></i>'
									: noteInstance.dueDate
							}</button>
						</p>
					</div>
				</div>
			</div>`;
	}

	/**
	 * Get common card element selectors
	 */
	static getCardElements(cardElement) {
		return {
			titleInput: cardElement.querySelector('#newTaskTitle'),
			descriptionInput: cardElement.querySelector('#newTaskDescription'),
			threeDotMenu: cardElement.querySelector('.threeDotMenu'),
			dueDateContainer: cardElement.querySelector('.dueDateContainer'),
			dueCustomDateButton: cardElement.querySelector('.dueCustomDate'),
			dueTodayButton: cardElement.querySelector('.dueToday'),
			dueTomorrowButton: cardElement.querySelector('.dueTomorrow'),
			checkbox: cardElement.querySelector('input[type="checkbox"]'),
		};
	}
}
