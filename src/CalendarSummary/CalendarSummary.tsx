import React, { useEffect, useState } from 'react';
import './CalendarSummary.css'
import { getCalendarEvents } from '../api-client';
import { CalendarEvent } from '../api-client';

interface DailyEvent {
	date: Date;
	calendarEvents: CalendarEvent[];
}

const CalendarSummary: React.FunctionComponent = () => {
	const [dailyEvents, setDailyEvents] = useState<DailyEvent[] | null>(null);
	const [totalPeriodEventsCount, setTotalPeriodEventsCount] =
		useState<number>(0);
	const [totalPeriodDuration, setTotalPeriodDuration] = useState<number>(0);
	const [longestPeriodEvents, setLongestPeriodEvents] = useState<
		CalendarEvent[] | null
	>(null);

	useEffect(() => {
		fetchData(7).then((data) => {
			// console.log(data);
			setDailyEvents(data);

			const totalPeriodEventsCount = data.reduce((acc, curr) => {
				return acc + getTotalDailyEvents(curr);
			}, 0);
			setTotalPeriodEventsCount(totalPeriodEventsCount);

			//total weekly duration
			const totalPeriodDuration = data.reduce((acc, curr) => {
				return acc + getTotalDailyDuration(curr);
			}, 0);
			setTotalPeriodDuration(totalPeriodDuration);

			// longest weekly
			const longestPeriodEvents = getLongestPeriodEvents(data);
			setLongestPeriodEvents(longestPeriodEvents);
		});
	}, []);

	const fetchData = async (daysNumber: number) => {
		const fetchDailyEvents: DailyEvent[] = [];
		// loop through number of required days
		for (let index = 0; index < daysNumber; index++) {
			let date = new Date();
			date.setDate(date.getDate() + index);
			try {
				const calendarEvents = await getCalendarEvents(date);

				// store calendarEvents and the date in new object type DailyEvent
				const calendarEventDate: DailyEvent = {
					date,
					calendarEvents,
				};
				fetchDailyEvents.push(calendarEventDate);
			} catch (error) {
				console.error('Error fetching events:', error);
			}
		}
		return fetchDailyEvents;
	};

	const getTotalDailyDuration = (day: DailyEvent) => {
		return day.calendarEvents.reduce(
			(acc, curr) => acc + curr.durationInMinutes,
			0
		);
	};

	const getTotalDailyEvents = (day: DailyEvent) => {
		return day.calendarEvents.length;
	};

	const getLongestPeriodEvents = (data: DailyEvent[]) => {
		let longestDuration = 0;
		// search for the longest weekly event
		data.forEach((dayEvents) => {
			dayEvents.calendarEvents.forEach((event) => {
				if (event.durationInMinutes > longestDuration) {
					longestDuration = event.durationInMinutes;
				}
			});
		});

		// check if there are more than one event with the longestDuration
		const longestEvents: CalendarEvent[] = [];
		data.forEach((dayEvents) => {
			dayEvents.calendarEvents.forEach((event) => {
				if (event.durationInMinutes === longestDuration) {
					longestEvents.push(event);
				}
			});
		});
		return longestEvents;
	};

	return (
		<div>
			<h2>Calendar summary</h2>
			{dailyEvents === null ? (
				<div>Loading...</div>
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
					<tbody>
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
					</tbody>
				</table>
			)}
		</div>
	);
};

export default CalendarSummary;
