import { Notification, useToast } from '@zendeskgarden/react-notifications'

/** Flora success toast — top-end placement is set on ToastProvider */
export function useSuccessToast() {
  const { addToast } = useToast()

  return (title, body) => {
    addToast(
      ({ close }) => (
        <Notification type="success" style={{ maxWidth: 300 }}>
          <Notification.Title>{title}</Notification.Title>
          {body ? <Notification.Paragraph>{body}</Notification.Paragraph> : null}
          <Notification.Close aria-label="Close notification" onClick={close} />
        </Notification>
      ),
      { placement: 'top-end' },
    )
  }
}
