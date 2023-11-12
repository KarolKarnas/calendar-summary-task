import React, { useEffect, useState } from 'react';
import './CalendarSummary.css';
import { getCalendarEvents } from '../api-client';
import { CalendarEvent } from '../api-client';

interface DailyEvents {
	date: Date;
	eventsNumber: number;
	totalDuration: number;
	longestEvent: CalendarEvent;
}

const CalendarSummary: React.FunctionComponent = () => {
	const [dailyEvents, setDailyEvents] = useState<DailyEvents[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [isError, setIsError] = useState<boolean>(false);
	console.log(dailyEvents);

	useEffect(() => {
		fetchAndSetData(7);
	}, []);

	const fetchAndSetData = async (daysNumber: number) => {
		try {
			setIsLoading(true);
			const fetchDailyEvents: DailyEvents[] = [];
			// loop through number of required days
			for (let index = 0; index < daysNumber; index++) {
				let date = new Date();
				date.setDate(date.getDate() + index);
				const calendarEvents = await getCalendarEvents(date);

				const longestEvent = calendarEvents.reduce((prev, curr) =>
					curr.durationInMinutes > prev.durationInMinutes ? curr : prev
				);

				// store calendarEvents and the date in new object type DailyEvents
				const calendarEventDate: DailyEvents = {
					date,
					eventsNumber: calendarEvents.length,
					totalDuration: calendarEvents.reduce(
						(acc, curr) => acc + curr.durationInMinutes,
						0
					),
					longestEvent: longestEvent,
				};
				fetchDailyEvents.push(calendarEventDate);
			}
			setDailyEvents(fetchDailyEvents);
			setIsLoading(false);
			return;
		} catch (error) {
			setIsError(true);
			console.error('Error fetching events:', error);
		}
	};

	return (
		<div>
			<h2>Calendar summary</h2>
			{isLoading ? (
				<div>Loading...</div>
			) : isError ? (
				<div>Error fetching data...</div>
			) : dailyEvents.length === 0 ? (
				<div>There is no events</div>
			) : (
				<table>
					<thead>
						<tr>
							<th>Date</th>
							<th>Number of Events</th>
							<th>Total duration [min] </th>
							<th>Longest event </th>
						</tr>
					</thead>
					<tbody>
						{dailyEvents.map((day, index) => (
							<tr key={index}>
								<td>{day.date.toISOString().split('T')[0]}</td>
								<td>{day.eventsNumber}</td>
								<td>{day.totalDuration}</td>
								<td>{day.longestEvent.title}</td>
							</tr>
						))}
						<tr className='total-row'>
							<td>Total</td>
							<td>
								{dailyEvents.reduce((acc, curr) => acc + curr.eventsNumber, 0)}
							</td>
							<td>
								{dailyEvents.reduce((acc, curr) => acc + curr.totalDuration, 0)}
							</td>
							<td>
								{
									dailyEvents.reduce((prev, curr) =>
										curr.longestEvent.durationInMinutes >
										prev.longestEvent.durationInMinutes
											? curr
											: prev
									).longestEvent.title
								}
							</td>
						</tr>
					</tbody>
				</table>
			)}
		</div>
	);
};

export default CalendarSummary;
