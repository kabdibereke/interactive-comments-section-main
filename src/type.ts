import { User } from "firebase/auth";
import { Dispatch, ReactNode, SetStateAction } from "react";

export interface IData {
	id: string;
	count: 0;
	message: string;
	user: string;
	avatarUrl: string | null;
	date: number;
	replies: [];
}

export interface IMessageFormProps {
	setData: Dispatch<SetStateAction<IData[]>>;
	data: IData[];
}

export interface AuthContextProvider {
	children: ReactNode;
}

export interface ContextType {
	user: User | null | undefined;
}
