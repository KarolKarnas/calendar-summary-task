import React, { useEffect, useState } from 'react';
import './CalendarSummary.css';
import { getCalendarEvents } from '../api-client';
import { CalendarEvent } from '../api-client';

interface DailyEvents {
	date: Date;
	eventsNumber: number;
	totalDuration: number;
	longestEvent: string;
}

const CalendarSummary: React.FunctionComponent = () => {
	const [dailyEvents, setDailyEvents] = useState<DailyEvents[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [isError, setIsError] = useState<boolean>(false);
	// const [totalPeriodEventsCount, setTotalPeriodEventsCount] =
	// 	useState<number>(0);
	// const [totalPeriodDuration, setTotalPeriodDuration] = useState<number>(0);
	// const [longestPeriodEvents, setLongestPeriodEvents] = useState<
	// 	CalendarEvent[] | null
	// >(null);

	useEffect(() => {
		fetchData(7);
	}, []);

	const fetchData = async (daysNumber: number) => {
		try {
			setIsLoading(true);
			const fetchDailyEvents: DailyEvents[] = [];
			// loop through number of required days
			for (let index = 0; index < daysNumber; index++) {
				let date = new Date();
				date.setDate(date.getDate() + index);
				const calendarEvents = await getCalendarEvents(date);

				const longestEvent = calendarEvents.reduce((longest, current) =>
					current.durationInMinutes > longest.durationInMinutes
						? current
						: longest
				);

				// store calendarEvents and the date in new object type DailyEvents
				const calendarEventDate: DailyEvents = {
					date,
					eventsNumber: calendarEvents.length,
					totalDuration: calendarEvents.reduce(
						(acc, curr) => acc + curr.durationInMinutes,
						0
					),
					longestEvent: longestEvent.title,
				};
				fetchDailyEvents.push(calendarEventDate);
			}
			setDailyEvents(fetchDailyEvents);
			setIsLoading(false);
			return;
		} catch (error) {
			console.error('Error fetching events:', error);
		} 
	};

	// const getTotalDailyDuration = (day: DailyEvent) => {
	// 	return day.calendarEvents.reduce(
	// 		(acc, curr) => acc + curr.durationInMinutes,
	// 		0
	// 	);
	// };

	// const getTotalDailyEvents = (day: DailyEvent) => {
	// 	return day.calendarEvents.length;
	// };

	// const getLongestPeriodEvents = (data: DailyEvent[]) => {
	// 	let longestDuration = 0;
	// 	// search for the longest weekly event
	// 	data.forEach((dayEvents) => {
	// 		dayEvents.calendarEvents.forEach((event) => {
	// 			if (event.durationInMinutes > longestDuration) {
	// 				longestDuration = event.durationInMinutes;
	// 			}
	// 		});
	// 	});

	// 	// check if there are more than one event with the longestDuration
	// 	const longestEvents: CalendarEvent[] = [];
	// 	data.forEach((dayEvents) => {
	// 		dayEvents.calendarEvents.forEach((event) => {
	// 			if (event.durationInMinutes === longestDuration) {
	// 				longestEvents.push(event);
	// 			}
	// 		});
	// 	});
	// 	return longestEvents;
	// };

	return (
		<div>
			<h2>Calendar summary</h2>
			{isLoading ? (
				<div>Loading...</div>
			) : isError ? (
				<div>Error</div>
			) : (
				<table>
					<thead>
						<tr>
							<th scope='col'>Date</th>
							<th scope='col'>Number of Events</th>
							<th scope='col'>Total duration [min] </th>
							<th scope='col'>Longest event </th>
						</tr>
					</thead>
					{/* <tbody>
						{dailyEvents.map((day, index) => (
							<tr key={index}>
								<td>{day.date.toISOString().split('T')[0]}</td>
								<td>{getTotalDailyEvents(day)}</td>
								<td>{getTotalDailyDuration(day)}</td>

								<td>
									{
										day.calendarEvents.reduce((prev, curr) =>
											prev.durationInMinutes > curr.durationInMinutes
												? prev
												: curr
										).title
									}
								</td>
							</tr>
						))}
						<tr className='total-row'>
							<td>Total</td>
							<td>{totalPeriodEventsCount}</td>
							<td>{totalPeriodDuration}</td>
							<td>
								{longestPeriodEvents ? (
									//if there are more than one event with longest duration, render them all
									longestPeriodEvents.length > 1 ? (
										<div className='longest-events'>
											<span>{`There was more than one longest event:`}</span>
											{longestPeriodEvents.map((event, index) => (
												<span key={index}> {event.title}</span>
											))}
										</div>
									) : (
										<span>{longestPeriodEvents[0].title}</span>
									)
								) : null}
							</td>
						</tr>
					</tbody> */}
				</table>
			)}
		</div>
	);
};

export default CalendarSummary;
