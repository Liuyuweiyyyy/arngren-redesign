
import { useState } from "react";

export default function MemberPages({
  page,
  user,
  products = [],
  orders = [],
  inquiries = [],
  onLogin,
  onRegister,
  onNavigate,
  onToggleFavorite,
  getProductImage,
  formatPrice,
}) {
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // 相容新專案的商品圖片與價格格式
  const productImage = (product) => {
    if (getProductImage) {
      return getProductImage(product);
    }

    return product.image || product.images?.[0] || "";
  };

  const productPrice = (price) => {
    if (price == null) {
      return "待詢價";
    }

    if (formatPrice) {
      return formatPrice(price);
    }

    return `kr ${Number(price).toLocaleString("en-US")}`;
  };

  function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("請填寫 Email 和密碼。");
      return;
    }

    if (password.length < 6) {
      setError("密碼至少需要 6 個字元。");
      return;
    }

    if (page === "register") {
      if (!displayName.trim()) {
        setError("請輸入顯示名稱。");
        return;
      }

      if (!onRegister) {
        setError("註冊功能尚未接上。");
        return;
      }

      onRegister(
        {
          displayName: displayName.trim(),
          email: email.trim().toLowerCase(),
          password,
        },
        setError
      );

      return;
    }

    if (!onLogin) {
      setError("登入功能尚未接上。");
      return;
    }

    onLogin(
      {
        email: email.trim().toLowerCase(),
        password,
      },
      setError
    );
  }

  // 登入與註冊
  if (page === "login" || page === "register") {
    const isRegister = page === "register";

    return (
      <main className="member-page">
        <section className="member-panel">
          <h1>{isRegister ? "建立會員帳號" : "會員登入"}</h1>

          <p>
            {isRegister
              ? "加入 ARNGREN RC STORE"
              : "登入以查看你的會員資料"}
          </p>

          <form onSubmit={handleSubmit}>
            {isRegister && (
              <label className="member-field">
                顯示名稱
                <input
                  value={displayName}
                  onChange={(event) =>
                    setDisplayName(event.target.value)
                  }
                  placeholder="請輸入名稱"
                  autoComplete="nickname"
                  required
                />
              </label>
            )}

            <label className="member-field">
              Email
              <input
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                placeholder="name@example.com"
                autoComplete="email"
                required
              />
            </label>

            <label className="member-field">
              密碼
              <input
                type="password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                placeholder="請輸入密碼"
                autoComplete={
                  isRegister ? "new-password" : "current-password"
                }
                minLength={6}
                required
              />
            </label>

            {error && (
              <p className="member-error" role="alert">
                {error}
              </p>
            )}

            <button
              className="member-primary-button"
              type="submit"
            >
              {isRegister ? "註冊" : "登入"}
            </button>
          </form>

          <p className="member-switch">
            {isRegister ? "已經有帳號？" : "還沒有帳號？"}

            <button
              type="button"
              onClick={() =>
                onNavigate(isRegister ? "login" : "register")
              }
            >
              {isRegister ? "立即登入" : "立即註冊"}
            </button>
          </p>
        </section>
      </main>
    );
  }

  // 尚未登入時，不顯示會員私人頁面
  if (!user) {
    return (
      <main className="member-page">
        <section className="member-panel">
          <h1>請先登入會員</h1>

          <button
            className="member-primary-button"
            type="button"
            onClick={() => onNavigate("login")}
          >
            前往登入
          </button>
        </section>
      </main>
    );
  }

  // 個人資料
  if (page === "profile") {
    return (
      <main className="member-page">
        <section className="member-panel member-panel-wide">
          <h1>個人資料</h1>

          <div className="profile-row">
            <span>使用者 ID</span>
            <strong>{user.id || "尚未設定"}</strong>
          </div>

          <div className="profile-row">
            <span>顯示名稱</span>
            <strong>{user.displayName || "會員"}</strong>
          </div>

          <div className="profile-row">
            <span>Email</span>
            <strong>{user.email || "尚未設定"}</strong>
          </div>

          <div className="profile-row">
            <span>收藏商品數量</span>
            <strong>
              {(user.favorites || []).length}
            </strong>
          </div>
        </section>
      </main>
    );
  }

  // 我的訂單：由 App.jsx 傳入訂單資料
  if (page === "orders") {
    return (
      <main className="member-page">
        <section className="member-panel member-panel-wide">
          <h1>我的訂單</h1>

          {orders.length === 0 ? (
            <p>目前尚無訂單紀錄。</p>
          ) : (
            orders.map((order) => (
              <article
                className="member-favorite-card"
                key={order.id || order.code}
              >
                <div>
                  <h3>
                    訂單編號：{order.code || order.id}
                  </h3>
                  <p>
                    狀態：{order.status || "處理中"}
                  </p>
                  {order.total != null && (
                    <p>金額：{productPrice(order.total)}</p>
                  )}
                </div>
              </article>
            ))
          )}

          <p className="member-muted">
            訂單資料需由 App.jsx 或後端提供。
          </p>
        </section>
      </main>
    );
  }

  // 我的詢問
  if (page === "inquiries") {
    return (
      <main className="member-page">
        <section className="member-panel member-panel-wide">
          <h1>我的詢問</h1>

          {inquiries.length === 0 ? (
            <p>目前尚無商品詢問紀錄。</p>
          ) : (
            inquiries.map((inquiry) => (
              <article
                className="member-favorite-card"
                key={inquiry.id || inquiry.code}
              >
                <div>
                  <h3>
                    {inquiry.productName || "商品詢問"}
                  </h3>
                  <p>
                    詢問編號：{inquiry.code || inquiry.id}
                  </p>
                  <p>
                    狀態：{inquiry.status || "等待回覆"}
                  </p>
                </div>
              </article>
            ))
          )}

          <p className="member-muted">
            詢問紀錄需由 App.jsx 或後端提供。
          </p>
        </section>
      </main>
    );
  }

  // 收藏商品
  if (page === "favorites") {
    const favoriteIds = user.favorites || [];

    const favoriteProducts = products.filter((product) =>
      favoriteIds.includes(product.id)
    );

    return (
      <main className="member-page">
        <section className="member-panel member-panel-wide">
          <h1>收藏商品</h1>

          {favoriteProducts.length === 0 ? (
            <p>目前尚無收藏商品，歡迎前往商品探索。</p>
          ) : (
            <div className="member-favorites">
              {favoriteProducts.map((product) => (
                <article
                  className="member-favorite-card"
                  key={product.id}
                >
                  <img
                    src={productImage(product)}
                    alt={product.name}
                  />

                  <div>
                    <h3>{product.name}</h3>

                    <p>{productPrice(product.price)}</p>

                    <button
                      type="button"
                      onClick={() =>
                        onToggleFavorite?.(product.id)
                      }
                    >
                      移除收藏
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        onNavigate(`detail/${product.id}`)
                      }
                    >
                      查看詳情
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}

          <button
            className="member-secondary-button"
            type="button"
            onClick={() => onNavigate("catalog")}
          >
            繼續探索商品
          </button>
        </section>
      </main>
    );
  }

  return null;
}