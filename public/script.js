// 載入資料並顯示在表格中
document.addEventListener('DOMContentLoaded', function () {
  fetch('http://localhost:3000/users')
      .then(response => response.json())
      .then(users => {
          const usersTable = document.getElementById('usersTable');
          users.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${user.phone}</td>
                <td>
                    <button onclick="deleteUser('${user._id}')">刪除</button> <!-- 注意這裡傳遞的是 user._id -->
                </td>
            `;
            usersTable.appendChild(row);
        });
      })
      .catch(error => console.error('無法獲取使用者資料:', error));
});


// 刪除資料
function deleteUser(userId) {
  if (!userId) {
      console.error("User ID is not provided");
      return;
  }

  fetch(`http://localhost:3000/users/${userId}`, {
      method: 'DELETE',
  })
  .then(response => response.json())
  .then(data => {
      alert('資料已刪除');
      location.reload();
  })
  .catch(error => {
      console.error('刪除失敗:', error);
  });
}








// 編輯資料
function editUser(userId) {
  console.log(userId);  // 輸出 ID，檢查是否有正確傳遞
  fetch(`http://localhost:3000/users/${userId}`)
      .then(response => response.json())
      .then(user => {
          document.getElementById('name').value = user.name;
          document.getElementById('email').value = user.email;
          document.getElementById('phone').value = user.phone;
      })
      .catch(error => console.error('無法獲取使用者資料:', error));
}

// 新增使用者資料
document.getElementById('userForm').addEventListener('submit', function (event) {
  event.preventDefault();  // 防止表單默認提交

  const userData = {
      name: document.getElementById('name').value,
      email: document.getElementById('email').value,
      phone: document.getElementById('phone').value
  };

  fetch('http://localhost:3000/users', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData)
  })
  .then(response => response.json())
  .then(data => {
      alert('資料新增成功!');
      location.reload();
  })
  .catch(error => {
      console.error('錯誤:', error);
      alert('資料新增失敗!');
  });
});
