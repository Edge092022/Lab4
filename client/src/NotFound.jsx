export default function NotFound({ message = 'Không tìm thấy trang bạn yêu cầu.' }) {
  return (
    <div role="alert" className="not-found">
      <h2>404</h2>
      <p>{message}</p>
    </div>
  );
}
