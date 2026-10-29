import { Notification, useToast } from '@zendeskgarden/react-notifications'

/** Flora success toast — top-end placement is set on ToastProvider.
 *  `title` may be a string or React node (e.g. ContentChange).
 *  Omit `body` (or pass null/undefined) for title-only toasts.
 */
export function useSuccessToast() {
  const { addToast } = useToast()

  return (title, body) => {
    addToast(
      ({ close }) => (
        <Notification type="success" style={{ maxWidth: 300 }}>
          <Notification.Title>{title}</Notification.Title>
          {body != null && body !== '' ? (
            <Notification.Paragraph>{body}</Notification.Paragraph>
          ) : null}
          <Notification.Close aria-label="Close notification" onClick={close} />
        </Notification>
      ),
      { placement: 'top-end' },
    )
  }
}
