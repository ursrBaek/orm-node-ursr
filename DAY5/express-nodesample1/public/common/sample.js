function fnValidation(e) {
  e.preventDefault();
  
  if(document.getElementById('email').value == '') {
    alert('메일주소 아이디를 입력해주세요.')
    document.getElementById('email').focus();
    return false;
  }

  if(document.getElementById('password').value == '') {
    alert('사용자 암호를 입력해주세요.')
    document.getElementById('password').focus();
    return false;
  }
}