import React, { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import "./App.css";
import {
	back,
	close,
	edit,
	inbox,
	inboxActive,
	menu,
	task,
	taskActive,
	person,
	schedule,
} from "./assets/index";
import { AnimatePresence, motion } from "framer-motion";

function App() {
	const [menuIsActive, setMenuIsActive] = useState(false);
	const [inboxShow, setInboxShow] = useState(false);
	const [taskShow, setTaskShow] = useState(false);
	const [isLoadingPost, setIsLoadingPost] = useState(true);
	const [isLoadingComment, setIsLoadingComment] = useState(true);
	const [messageOption, setMessageOption] = useState(false);
	const [messageIndex, setMessageIndex] = useState();

	const menuShow = () => {
		setMenuIsActive((state) => !state);
	};
	const inboxTrigger = () => {
		if (taskShow === true && inboxShow === false) {
			setTaskShow(false);
			setInboxShow((state) => !state);
		} else {
			setInboxShow((state) => !state);
		}
	};
	const taskTrigger = () => {
		if (inboxShow === true && taskShow === false) {
			setInboxShow(false);
			setTaskShow((state) => !state);
		} else {
			setTaskShow((state) => !state);
		}
	};
	const handleMessageOption = (e, index) => {
		e.preventDefault();
		setMessageIndex(index);
		setMessageOption((state) => !state);
	};

	const handleDeleteMessage = (e, item) => {
		e.preventDefault();
		deleteMessage(item);
	};

	const deleteMessage = (item) => {
		axios
			.delete(`https://dummyapi.io/data/v1/comment/${item.id}`, {
				headers: {
					"app-id": "641071802115a45e30a446fc",
				},
			})
			.then((result) => {
				console.log(result);
				getComment(item.post);
				setMessageOption((state) => !state);
			})
			.catch((error) => {
				console.log(error);
			});
	};

	// Get post
	const [messages, setMessages] = useState([]);
	useEffect(() => {
		getMessages();
	}, []);

	const getMessages = () => {
		axios
			.get("https://dummyapi.io/data/v1/post?limit=5", {
				headers: {
					"app-id": "641071802115a45e30a446fc",
				},
			})
			.then((response) => {
				setMessages(response.data.data);
			})
			.catch((error) => {
				console.log(error);
			});
	};

	// Get Comment
	const [userMessage, setUserMessage] = useState([]);
	const [postById, setPostById] = useState([]);
	const [openInbox, setOpenInbox] = useState(false);
	console.log(userMessage);

	const getComment = (id, handleSuccess) => {
		axios
			.get(`https://dummyapi.io/data/v1/post/${id}/comment`, {
				headers: {
					"app-id": "641071802115a45e30a446fc",
				},
			})
			.then((response) => {
				setUserMessage(response.data.data.reverse());
				handleSuccess();
			})
			.catch((error) => {
				console.log(error);
			});
	};

	const getPostById = (id, handleSuccess) => {
		axios
			.get(`https://dummyapi.io/data/v1/post/${id}`, {
				headers: {
					"app-id": "641071802115a45e30a446fc",
				},
			})
			.then((response) => {
				setPostById(response);
				handleSuccess();
			})
			.catch((error) => {
				console.log(error);
			});
	};

	const handleMessage = (e, item) => {
		e.preventDefault();
		const handleSuccessComment = () => {
			setIsLoadingComment(false);
		};
		const handleSuccessPost = () => {
			setIsLoadingPost(false);
		};
		setOpenInbox(true);
		getComment(item.id, handleSuccessComment);
		getPostById(item.id, handleSuccessPost);
		setIdPost(item.id);
	};

	const handleBack = () => {
		setOpenInbox(false);
		setIsLoadingPost((state) => !state);
		setIsLoadingComment((state) => !state);
		setPostById([]);
		setUserMessage([]);
		setIdPost("");
	};

	// send comment
	const [comment, setComment] = useState("");
	const [idPost, setIdPost] = useState("");

	const onSubmitComment = (e) => {
		e.preventDefault();
		let body = {
			owner: "6415183ed47f4d534984ee6f",
			post: idPost,
			message: comment,
		};

		axios
			.post(`https://dummyapi.io/data/v1/comment/create`, body, {
				headers: {
					"app-id": "641071802115a45e30a446fc",
				},
			})
			.then((response) => {
				getComment(idPost);
			})
			.catch((error) => {
				console.log(error);
			});
	};

	// Task
	const [tasks, setTasks] = useState([]);

	useEffect(() => {
		getTask();
	}, []);

	const getTask = () => {
		axios
			.get(`https://641755c40aec6258854821db.mockapi.io/api/todos/Todos`)
			.then((result) => {
				setTasks(result.data);
			})
			.catch((error) => {
				console.log(error);
			});
	};

	const [newTasks, setNewTasks] = useState(false);
	const [tasksForm, setTasksForm] = useState({
		title: "",
		date: "",
		description: "",
		finish: false,
	});

	const postTask = (form) => {
		axios
			.post(`https://641755c40aec6258854821db.mockapi.io/api/todos/Todos`, form)
			.then((result) => {
				getTask();
			})
			.catch((error) => {
				console.log(error);
			});
	};

	const addTask = (e) => {
		e.preventDefault();
		const body = {
			title: tasksForm.title,
			date: tasksForm.date,
			description: tasksForm.description,
		};

		postTask(body);
	};

	const deleteTask = (id) => {
		axios
			.delete(
				`https://641755c40aec6258854821db.mockapi.io/api/todos/Todos/${id}`
			)
			.then((result) => {
				getTask();
			})
			.catch((error) => {
				console.log(error);
			});
	};

	const handleDelete = (e, id) => {
		e.preventDefault();
		deleteTask(id);
	};

	const updateCheck = (id, form) => {
		axios
			.put(
				`https://641755c40aec6258854821db.mockapi.io/api/todos/Todos/${id}`,
				form
			)
			.then((result) => {
				getTask();
			})
			.catch((error) => {
				console.log(error);
			});
	};

	const handleCheck = (e, id) => {
		const checked = e.target.checked;
		const body = {
			finish: checked,
		};
		updateCheck(id, body);
	};

	const handleDate = (e, id) => {
		const date = e.target.value;
		const body = {
			date: date,
		};
		updateCheck(id, body);
	};

	return (
		<>
			<AnimatePresence>
				<div className="container-fluid d-flex">
					<div className="leftBox"></div>
					<div className="rightBox">
						<input
							type="text"
							className="searchInput p-3"
							placeholder="&#xf002;"
							style={{ fontFamily: "FontAwesome" }}
						/>
						{inboxShow === true ? (
							<div className="workspace d-flex">
								{openInbox === false ? (
									<div className="mx-auto">
										<div className="p-3">
											<input
												type="search"
												className="inboxSearch px-5"
												placeholder="search"
											/>
										</div>
										<div>
											{messages.map((item, index) => (
												<div key={index}>
													<div
														className="d-flex p-2 border-bottom"
														type="button"
														onClick={(e) => handleMessage(e, item)}>
														<div className="person d-flex">
															<img
																src={person}
																className="photoProfile m-auto"
																alt="tab"
															/>
														</div>
														<p className="name ms-3">{item.text}</p>
														<p className="ms-3 dates">
															{item.publishDate.split("T")[0]}{" "}
															<span>
																{item.publishDate.split("T")[1].split(".")[0]}
															</span>
														</p>
													</div>
												</div>
											))}
										</div>
									</div>
								) : isLoadingPost === false && isLoadingComment === false ? (
									<>
										<div>
											<div className="d-flex p-3 border-bottom">
												<div>
													<img
														src={back}
														alt="back"
														onClick={() => handleBack()}
													/>
												</div>
												{postById.data ? (
													<p className="name mx-3">{postById.data.text}</p>
												) : null}
												<div
													className="close pe-4"
													type="button"
													onClick={() => inboxTrigger()}>
													<img
														src={close}
														alt="close"
													/>
												</div>
											</div>
											<div className="overflow-auto displayChat mb-5">
												{userMessage.map((item, index) => (
													<div
														key={index}
														className="mt-2">
														{item.owner.id === "6415183ed47f4d534984ee6f" ? (
															<div className="d-flex flex-row-reverse me-2">
																<div>
																	<p className="text-secondary d-flex flex-row-reverse mb-0">
																		You
																	</p>
																	<div className="d-flex">
																		{messageOption === true &&
																			messageIndex === index ? (
																			<div>
																				<div
																					type="button"
																					className="messageOption ps-2 py-2 text-primary rounded-top border">
																					Edit
																				</div>
																				<div
																					type="button"
																					className="text-danger ps-2 py-2 rounded-bottom border border-top-0"
																					onClick={(e) =>
																						handleDeleteMessage(e, item)
																					}>
																					Delete
																				</div>
																			</div>
																		) : (
																			<></>
																		)}
																		<button
																			className="btn options"
																			onClick={(e) =>
																				handleMessageOption(e, index)
																			}>
																			...
																		</button>
																		<p className="p-3 sentMessage rounded">
																			{item.message}
																			<span className="d-block timestamp">
																				{item.publishDate
																					.split("T")[1]
																					.split(".")[0]
																					.substr(0, 5)}
																			</span>
																		</p>
																	</div>
																</div>
															</div>
														) : (
															<div className="ms-3">
																<p className="ownerName">
																	{item.owner.firstName} {item.owner.lastName}
																</p>
																<div className="d-flex">
																	<p className="receiveMessage py-2 px-3">
																		{item.message}
																		<span className="d-block timestamp">
																			{item.publishDate
																				.split("T")[1]
																				.split(".")[0]
																				.substr(0, 5)}
																		</span>
																	</p>
																	<button className="btn options">...</button>
																</div>
															</div>
														)}
													</div>
												))}
											</div>
											<form onSubmit={(e) => onSubmitComment(e)}>
												<div className="inputMessage d-flex p-4 ms-2">
													<input
														type="text"
														className="form-control formInputs"
														placeholder="Type a new messages"
														onChange={(e) => setComment(e.target.value)}
													/>
													<button
														type="submit"
														className="btn btn-primary flex-end submitInputs ms-3">
														Send
													</button>
												</div>
											</form>
										</div>
									</>
								) : (
									<div className="m-auto">
										<div className="d-flex">
											<div
												className="spinner-border text-secondary mx-auto"
												role="status"></div>
										</div>
										<p className="text-center mt-3">Loading Chats...</p>
									</div>
								)}
							</div>
						) : taskShow === true ? (
							<div className="workspace">
								{newTasks === true ? (
									<div className="newTask me-3 p-3">
										<form onSubmit={(e) => addTask(e)}>
											<div className="d-flex justify-content-center">
												<input
													type="text"
													className="form-control taskTitleForm"
													placeholder="Type task title"
													onChange={(e) =>
														setTasksForm({ ...tasksForm, title: e.target.value })
													}
												/>
											</div>
											<div className="d-flex ms-3 my-3">
												<div className="me-3">
													<img
														src={schedule}
														alt="date"
													/>
												</div>
												<input
													type="date"
													onChange={(e) =>
														setTasksForm({ ...tasksForm, date: e.target.value })
													}
													className="tasksDates p-1"
												/>
											</div>
											<div className="d-flex justify-content-center ms-3">
												<div className="me-3">
													<img
														src={edit}
														alt="description"
													/>
												</div>
												<input
													type="text"
													className="form-control taskTitleForm"
													placeholder="No Description"
													onChange={(e) =>
														setTasksForm({
															...tasksForm,
															description: e.target.value,
														})
													}
												/>
											</div>
											<div className="d-flex justify-content-end mt-3">
												<button
													className="btn btn-primary"
													type="submit">
													Submit
												</button>
											</div>
										</form>
									</div>
								) : (
									<></>
								)}
								<div className="headers d-flex justify-content-between m-3">
									<div></div>
									<div className="dropdown">
										<button
											className="btn btn-light dropdown-toggle"
											type="button"
											data-bs-toggle="dropdown"
											aria-expanded="false">
											My Task
										</button>
										<ul className="dropdown-menu">
											<li>
												<p className="dropdown-item">Personal Errands</p>
											</li>
											<li>
												<p className="dropdown-item">Urgent To-Do</p>
											</li>
										</ul>
									</div>
									<div className="">
										<button
											className="btn btn-primary"
											onClick={() => setNewTasks((state) => !state)}>
											New Task
										</button>
									</div>
								</div>
								<div className="overflow-auto taskDisplay">
									{tasks.length > 0 ? (
										tasks.map((item, index) => (
											<div key={index}>
												<div
													className="accordion accordion-flush border-bottom"
													id={`accordionFlushExample${index}`}>
													<div className="accordion-item">
														<div className="form-check">
															{item.finish === true ? (
																<input
																	className="form-check-input taskCheck"
																	type="checkbox"
																	value=""
																	id="flexCheckDefault"
																	onChange={(e) => handleCheck(e, item.id)}
																	defaultChecked={true}
																/>
															) : (
																<input
																	className="form-check-input taskCheck"
																	type="checkbox"
																	value=""
																	id="flexCheckDefault"
																	onChange={(e) => handleCheck(e, item.id)}
																	defaultChecked={false}
																/>
															)}
															<h2
																className="accordion-header"
																id={`flush-headingOne${index}`}>
																<button
																	className={
																		item.finish === true
																			? `accordion-button collapsed taskTitle text-decoration-line-through text-secondary`
																			: `accordion-button collapsed taskTitle`
																	}
																	type="button"
																	data-bs-toggle="collapse"
																	data-bs-target={`#flush-collapseOne${index}`}
																	aria-expanded="false"
																	aria-controls={`flush-collapseOne${index}`}>
																	{item.title}
																</button>
															</h2>
														</div>
														<div
															id={`flush-collapseOne${index}`}
															className="accordion-collapse collapse"
															aria-labelledby="flush-headingOne"
															data-bs-parent={`#accordionFlushExample${index}`}>
															<div className="accordion-body">
																<div className="d-flex justify-content-between">
																	<div className="d-flex ms-3">
																		<div className="me-3">
																			<img
																				src={schedule}
																				alt="date"
																			/>
																		</div>
																		<input
																			type="date"
																			defaultValue={item.date}
																			onChange={(e) => handleDate(e, item.id)}
																			className="tasksDates p-1"
																		/>
																	</div>
																	<button
																		className="btn rounded border border-secondary text-danger"
																		onClick={(e) => handleDelete(e, item.id)}>
																		Delete
																	</button>
																</div>
																<div className="d-flex ms-3">
																	<div className="me-3">
																		<img
																			src={edit}
																			alt="description"
																		/>
																	</div>
																	<p>{item.description}</p>
																</div>
															</div>
														</div>
													</div>
												</div>
											</div>
										))
									) : (
										<></>
									)}
								</div>
							</div>
						) : (
							<></>
						)}
					</div>
					<div className="d-flex menuPosition">
						{menuIsActive === false ? (
							<></>
						) : inboxShow === true ? (
							<>
								<div className="me-4">
									<motion.div
										whileTap={{ scale: 1.1 }}
										className="menus menu2"
										type="button"
										onClick={() => taskTrigger()}>
										<img
											src={task}
											alt="menu"
											className="menuLogo"
										/>
									</motion.div>
								</div>
								<div className="me-4">
									<motion.div
										whileTap={{ scale: 1.1 }}
										className="menu2Active menus"
										type="button"
										onClick={() => inboxTrigger()}>
										<img
											src={inboxActive}
											alt="menu"
											className="menuLogo"
										/>
									</motion.div>
								</div>
							</>
						) : taskShow === true ? (
							<>
								<div className="me-4">
									<motion.div
										whileTap={{ scale: 1.1 }}
										className="menus menu2"
										type="button"
										onClick={() => inboxTrigger()}>
										<img
											src={inbox}
											alt="menu"
											className="menuLogo"
										/>
									</motion.div>
								</div>
								<div className="me-4">
									<motion.div
										whileTap={{ scale: 1.1 }}
										className="menu2Active menus"
										type="button"
										onClick={() => taskTrigger()}>
										<img
											src={taskActive}
											alt="menu"
											className="menuLogo"
										/>
									</motion.div>
								</div>
							</>
						) : (
							<>
								<AnimatePresence>

									<motion.div
										initial={{ x: 10, opacity: 0 }}
										animate={{ x: 0, opacity: 1 }}
										exit={{ x: 10, opacity: 0 }}
										className="me-4">
										<p className="texts">Task</p>
										<div
											whileTap={{ scale: 1.1 }}
											className="menus menu2"
											type="button"
											onClick={() => taskTrigger()}>
											<img
												src={task}
												alt="menu"
												className="menuLogo"
											/>
										</div>
									</motion.div>
									<div
										className="me-4">
										<p className="texts">Inbox</p>
										<div
											whileTap={{ scale: 1.1 }}
											className="menu2 menus"
											type="button"
											onClick={() => inboxTrigger()}>
											<img
												src={inbox}
												alt="menu"
												className="menuLogo"
											/>
										</div>
									</div>
								</AnimatePresence>
							</>
						)}
						{inboxShow === false && taskShow === false ? (
							<AnimatePresence>
								<motion.div
									animate={{ x: 0, opacity: 1 }}
									exit={{ x: 10, opacity: 0 }}
									whileTap={{ scale: 1.1 }}
									className="menu1"
									type="button"
									onClick={() => menuShow()}>
									<img
										src={menu}
										alt="menu"
										className="menuLogo"
									/>
								</motion.div>
							</AnimatePresence>
						) : (
							<></>
						)}
					</div>
				</div>
			</AnimatePresence>
		</>
	);
}

export default App;