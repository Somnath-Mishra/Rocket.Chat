import type { IRoom } from '@rocket.chat/core-typings';
import { createContext, useContext } from 'react';
import { useSyncExternalStore } from 'use-sync-external-store/shim';

import type { DirectCallData, ProviderCapabilities, CallPreferences, VideoConfManager } from '../lib/VideoConfManager';

export type VideoConfPopupPayload = {
	id: string;
	rid: IRoom['_id'];
	isReceiving?: boolean;
};

type VideoConfContextValue = {
	manager: typeof VideoConfManager;
	dispatchOutgoing: (options: Omit<VideoConfPopupPayload, 'id'>) => void;
	dismissOutgoing: () => void;
	startCall: (rid: IRoom['_id'], title?: string) => void;
	acceptCall: (callId: string) => void;
	joinCall: (callId: string) => void;
	dismissCall: (callId: string) => void;
	rejectIncomingCall: (callId: string) => void;
	abortCall: () => void;
	setPreferences: (prefs: { mic?: boolean; cam?: boolean }) => void;
	queryIncomingCalls: {
		subscribe: (cb: () => void) => () => void;
		getSnapshot: () => DirectCallData[];
	};
	queryRinging: {
		subscribe: (cb: () => void) => () => void;
		getSnapshot: () => boolean;
	};
	queryCalling: {
		subscribe: (cb: () => void) => () => void;
		getSnapshot: () => boolean;
	};
	queryCapabilities: {
		subscribe: (cb: () => void) => () => void;
		getSnapshot: () => ProviderCapabilities;
	};
	queryPreferences: {
		subscribe: (cb: () => void) => () => void;
		getSnapshot: () => CallPreferences;
	};
};

export const VideoConfContext = createContext<VideoConfContextValue | undefined>(undefined);
const useVideoConfContext = (): VideoConfContextValue => {
	const context = useContext(VideoConfContext);
	if (!context) {
		throw new Error('Must be running in VideoConf Context');
	}

	return context;
};

export const useVideoConfDispatchOutgoing = (): VideoConfContextValue['dispatchOutgoing'] => useVideoConfContext().dispatchOutgoing;
export const useVideoConfDismissOutgoing = (): VideoConfContextValue['dismissOutgoing'] => useVideoConfContext().dismissOutgoing;
export const useVideoConfStartCall = (): VideoConfContextValue['startCall'] => useVideoConfContext().startCall;
export const useVideoConfAcceptCall = (): VideoConfContextValue['acceptCall'] => useVideoConfContext().acceptCall;
export const useVideoConfJoinCall = (): VideoConfContextValue['joinCall'] => useVideoConfContext().joinCall;
export const useVideoConfDismissCall = (): VideoConfContextValue['dismissCall'] => useVideoConfContext().dismissCall;
export const useVideoConfAbortCall = (): VideoConfContextValue['abortCall'] => useVideoConfContext().abortCall;
export const useVideoConfRejectIncomingCall = (): VideoConfContextValue['rejectIncomingCall'] => useVideoConfContext().rejectIncomingCall;
export const useVideoConfIncomingCalls = (): DirectCallData[] => {
	const { queryIncomingCalls } = useVideoConfContext();
	return useSyncExternalStore(queryIncomingCalls.subscribe, queryIncomingCalls.getSnapshot);
};
export const useVideoConfSetPreferences = (): VideoConfContextValue['setPreferences'] => useVideoConfContext().setPreferences;
export const useVideoConfIsRinging = (): boolean => {
	const { queryRinging } = useVideoConfContext();
	return useSyncExternalStore(queryRinging.subscribe, queryRinging.getSnapshot);
};
export const useVideoConfIsCalling = (): boolean => {
	const { queryCalling } = useVideoConfContext();
	return useSyncExternalStore(queryCalling.subscribe, queryCalling.getSnapshot);
};
export const useVideoConfCapabilities = (): ProviderCapabilities => {
	const { queryCapabilities } = useVideoConfContext();
	return useSyncExternalStore(queryCapabilities.subscribe, queryCapabilities.getSnapshot);
};
export const useVideoConfPreferences = (): CallPreferences => {
	const { queryPreferences } = useVideoConfContext();
	return useSyncExternalStore(queryPreferences.subscribe, queryPreferences.getSnapshot);
};

export const useVideoConfManager = (): typeof VideoConfManager | undefined => useContext(VideoConfContext)?.manager;
