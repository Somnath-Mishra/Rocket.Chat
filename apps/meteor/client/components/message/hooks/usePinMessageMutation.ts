import type { IMessage } from '@rocket.chat/core-typings';
import { useEndpoint, useToastMessageDispatch } from '@rocket.chat/ui-contexts';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { updatePinMessage } from '../../../lib/mutationEffects/updatePinMessage';
import { roomsQueryKeys } from '../../../lib/queryKeys';

export const usePinMessageMutation = () => {
	const { t } = useTranslation();
	const pinMessageEndpoint = useEndpoint('POST', '/v1/chat.pinMessage');
	const dispatchToastMessage = useToastMessageDispatch();

	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (message: IMessage) => pinMessageEndpoint({ messageId: message._id }),
		onMutate: (message) => {
			updatePinMessage(message, { pinned: true });
		},
		onSuccess: (_data) => {
			dispatchToastMessage({ type: 'success', message: t('Message_has_been_pinned') });
		},
		onError: (error, message) => {
			dispatchToastMessage({ type: 'error', message: error });
			updatePinMessage(message, { pinned: false });
		},
		onSettled: (_data, _error, message) => {
			queryClient.invalidateQueries(roomsQueryKeys.pinnedMessages(message.rid));
			queryClient.invalidateQueries(roomsQueryKeys.messageActions(message.rid, message._id));
		},
	});
};
