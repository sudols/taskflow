import './style.css';
import '@tabler/icons-webfont/dist/tabler-icons.css';
import { TaskCardRenderer } from './components/TaskCardRenderer.js';
// import flatpickr from 'flatpickr';
// import 'flatpickr/dist/flatpickr.min.css';

// Each note stored with unique key
// "uuid": {
//   id: "uuid",
//   title: "Meeting Notes",
//   description: "Discuss project timeline and deliverables",
//   dueDate: "2025-07-10T00:00:00Z",
//   priority: "high",
//   created: "2025-07-05T15:23:00Z",
//   modified: "2025-07-05T15:23:00Z",
//   completed: false
// }

if (module.hot) {
	module.hot.accept();
}

/*
example usage
setting default category
pushing 3 random notes to category
getting notes from default category
console logging notes

setting work category
pushing 2 random notes to work category
getting notes from work category
console logging notes

delete 1 note from work
then delete work category
*/
/*
template for note card
				<div
					class="flex items-center gap-4 bg-task-card-bg p-4 rounded-lg mb-4 mt-4"
				>
					<div>
						<label
							class="flex items-center justify-center cursor-pointer relative"
						>
							<input
								checked
								type="checkbox"
								class="peer h-5 w-5 cursor-pointer appearance-none rounded border bg-sort-btn-bg border-checkbox-border checked:bg-checkbox-checked checked:border-0 transition"
								id="check-custom-icon"
							/>
							<span
								class="absolute text-checkbox-icon opacity-0 peer-checked:opacity-100 transition"
							>
								<i class="ti ti-check"></i>
							</span>
						</label>
					</div>
					<div class="w-full flex flex-col gap-2">
						<div>
							<div class="flex items-center justify-between">
								<input
									type="text"
									name="taskTitle"
									id="taskTitle"
									placeholder="Title"
									class="outline-none text-heading text-lg font-semibold w-full"
								/>
								<button
									type="button"
									class="cursor-pointer hover:bg-generic-btn-hover hover:rounded"
								>
									<i class="ti ti-dots-vertical"></i>
								</button>
							</div>
							<input
								type="text"
								name="TaskDescription"
								id="TaskDescription"
								class="outline-none text-body text-sm line-clamp-2"
								placeholder="details"
							/>
						</div>
						<div>
							<p class="text-body text-xs flex items-center gap-2">
								<span>Due: </span>
								<button
									class="cursor-pointer hover:bg-generic-btn-hover rounded-sm p-1 pr-2 pl-2 taskDueToday"
									type="button"
									data-note-id="sample-uuid"
								>
									Today
								</button>
								<button
									class="cursor-pointer hover:bg-generic-btn-hover rounded-sm p-1 pr-2 pl-2 taskDueTomorrow"
									type="button"
									data-note-id="sample-uuid"
								>
									Tomorrow
								</button>
								<button
									class="cursor-pointer hover:bg-generic-btn-hover rounded-sm p-1 pr-2 pl-2 taskDueCustomDate"
									type="button"
									data-note-id="sample-uuid"
									type="button"
								>
									<i
										class="ti ti-calendar-event"
										data-note-id="sample-uuid"
									></i>
								</button>
							</p>
						</div>
					</div>
				</div>

template for card three dot menu
				<div
					class="flex flex-col mb-4 w-25 bg-generic-btn-focus rounded-md text-heading"
				>
					<div
						class="flex items-center p-2 gap-2 hover:bg-gray-600 hover:rounded-md hover:rounded-b-none"
					>
						<i class="ti ti-edit"></i>
						<button type="button">Edit</button>
					</div>
					<div
						class="flex items-center p-2 gap-2 hover:bg-gray-600 hover:rounded-md hover:rounded-t-none"
					>
						<i class="ti ti-trash"></i>
						<button type="button">Delete</button>
					</div>
				</div>


*/
