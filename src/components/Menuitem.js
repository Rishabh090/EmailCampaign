import React from 'react';
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import * as IoIcons from "react-icons/io";

export const MenuData = [
	{
		title: "Home",
		path: '/',
		icon: <AiIcons.AiFillHome />,
		cName: 'nav-text'
	},
	{
		title: "Create Email",
		path: '/create',
		icon: <IoIcons.IoIosPaper />,
		cName: 'nav-text'
	},
	{
		title: "Drafts",
		path: '/Draft',
		icon: <IoIcons.IoIosPaper />,
		cName: 'nav-text'
	}
]