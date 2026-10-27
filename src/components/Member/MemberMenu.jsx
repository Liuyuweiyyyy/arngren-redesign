import { useEffect, useRef, useState } from 'react';

export default function MemberMenu({
  user,
  currentPage,
  onNavigate,
  onLogout,
}) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  // 切換路由時自動關閉選單
  useEffect(() => {
    setOpen(false);
  }, [currentPage]);

  // 點擊選單外部，或按下 Escape 時關閉
  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    }

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    }

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener(
        'pointerdown',
        handlePointerDown
      );
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  function navigateTo(page) {
    setOpen(false);
    onNavigate(page);
  }

  function handleLogout() {
    setOpen(false);
    onLogout();
  }

  const guestItems = [
    { label: '登入', page: 'login' },
    { label: '註冊', page: 'register' },
  ];

  const memberItems = [
    { label: '個人資料', page: 'profile' },
    { label: '我的訂單', page: 'orders' },
    { label: '我的詢問', page: 'inquiries' },
    { label: '收藏商品', page: 'favorites' },
  ];

  const displayName = user?.displayName?.trim() || '會員';
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div className="member-menu" ref={menuRef}>
      <button
        type="button"
        className="member-avatar"
        aria-label="會員選單"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls="member-dropdown"
        title={user ? displayName : '會員登入'}
        onClick={() => setOpen(previous => !previous)}
      >
        {user?.displayName?.trim() ? (
          <span aria-hidden="true">{initial}</span>
        ) : (
          <svg
            viewBox="0 0 24 24"
            width="23"
            height="23"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="12" cy="8" r="4" />
            <path d="M4 21v-2a8 8 0 0 1 16 0v2" />
          </svg>
        )}
      </button>

      {open && (
        <div
          id="member-dropdown"
          className="member-dropdown"
          role="menu"
          aria-label="會員功能"
        >
          {user ? (
            <>
              <div className="member-dropdown-header">
                <strong>{displayName}</strong>
                <span>{user.email || ''}</span>
              </div>

              {memberItems.map(item => (
                <button
                  key={item.page}
                  type="button"
                  role="menuitem"
                  className="member-dropdown-item"
                  onClick={() => navigateTo(item.page)}
                >
                  {item.label}
                </button>
              ))}

              <div
                className="member-dropdown-divider"
                role="separator"
              />

              <button
                type="button"
                role="menuitem"
                className="member-dropdown-item member-logout"
                onClick={handleLogout}
              >
                登出
              </button>
            </>
          ) : (
            guestItems.map(item => (
              <button
                key={item.page}
                type="button"
                role="menuitem"
                className="member-dropdown-item"
                onClick={() => navigateTo(item.page)}
              >
                {item.label}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}