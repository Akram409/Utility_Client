/* eslint-disable react/prop-types */
import { DeleteOutlined } from "@ant-design/icons";
import { Button, Calendar, Modal, Row } from "antd";
import { useState } from "react";
import css from "../../../../styles/Calendar.module.css";

const EventCalendar = ({ events }) => {
	const [eventToRemove, setEventToRemove] = useState(null);
	const [activeLocale, setActiveLocale] = useState("en");
	const [isAddEventModalVisible, setAddEventModalVisible] = useState(false);

	const removeHandler = id => {
		setEventToRemove(id);
	};

	const okRemove = () => {
		if (eventToRemove) {
			// Handle event removal here (e.g., update events array or call a function)
			const updatedEvents = events?.filter(event => event.id !== eventToRemove);
			dispatchEvent({ type: "eventsUpdated", payload: updatedEvents }); // Emit event for parent component
		}
		setEventToRemove(null);
	};

	const cancelRemove = () => {
		setEventToRemove(null);
	};

	const dateCellRender = value => {
		const formatedValue = value.format("YYYY.MM.DD");
		const currDayEvents = events?.filter(event => event.date === formatedValue);

		return (
			<div>
				{currDayEvents?.map(ev => (
					<Row
						justify='space-between'
						className={css.border}
						key={ev.date + ev.description + ev.guest + ev.author}
					>
						<span className={css.description}>{ev.description}</span>
						<Button
							icon={<DeleteOutlined />}
							className={css.event__icon}
							onClick={() => removeHandler(ev.id)}
						/>
					</Row>
				))}
			</div>
		);
	};

	return (
		<>
			<Button
				className={css.navItem}
				onClick={() => setAddEventModalVisible(prevVisible => !prevVisible)}
				danger
				type='primary'
			>
				Add Event
			</Button>

			<Calendar cellRender={dateCellRender} className={css.calendar} locale={activeLocale} />

			<Modal
				title='Are you sure to delete this event?'
				open={!!eventToRemove}
				onOk={okRemove}
				onCancel={cancelRemove}
				okText='Yes'
				cancelText='No'
				centered
				closable={false}
				style={{ marginTop: "-5%" }}
				className='contentCenter'
			/>
		</>
	);
};

export default EventCalendar;
