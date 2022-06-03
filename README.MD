### sunhan 소개

---

<BR>

<img src="https://user-images.githubusercontent.com/62149784/171804477-6ead3615-c4dd-43fd-b363-c9bf44f2e447.jpg">

<br>

결식 아동을 위해 선한 영향력 가게와 아동급식카드 가맹점 정보를 알려주는 모바일 어플리케이션 입니다.

<br>
 
유저의 위치 정보를 기반으로 가맹점 정보를 거리순으로 제공하고,  음식 카테고리별로 가맹점 정보를 제공함으로써 유저에게 직관적인 정보를 제공합니다.

<br>

또한, 카카오 로그인, 커뮤니티, 가맹점 스크랩, 아동급식카드 잔액 조회 등의 편의 기능도 포함합니다.

<br>

이를 통해 기존 서비스의 불편한 UI, 가맹점 정보를 찾기 위한 편리성이 부족한 문제를 개선하였으며, 선한 영향력 가게와 아동급식카드 가맹점 정보를 동시에 제공함으로써 유저들이 가맹점 정보를 보다 쉽게 얻을 수 있습니다.

<br>

<br>

### 기술 스택

---

<br>

✔ Backend

- `Node.js`

- `Express`

<br>

✔ DB

- `MongoDB`

- `redis`

<br>

✔ DevOps

- `Docker`

- `AWS- EC2, S3`

<br>

### 1. Backend Architecture

---

<Br>

✔ Backend Architecture를 어떤 구조로 설계하였는지 소개하겠습니다.

<Br>

✔ API 명세서: https://documenter.getpostman.com/view/13091019/UyrEgaLy

<br>

### 1.1 3 Layer Architecture

---

<br>

<img src="https://user-images.githubusercontent.com/62149784/171850122-5fa41736-9131-4148-87a7-1f9b554eed35.png">

<br>

<br>

`3 Layer Architecture`는 Business Logic을 분리하는 것을 목적으로 합니다.

<br>

`Controller`, `Service Layer`, `Data Access Layer` 라는 `3 Layer`로 나뉩니다.

<br>

`Controller`는 client와의 통신에서 필요한 req, res를 다루는 부분이고, `Service Layer`은 Business Logic을 `Data Access Layer`은 DB와의 직접적인 통신을 다룹니다.

<br>
 
이 구조의 가장 큰 장점은 `확장성`입니다. 레이어 별로 분리하면 언제든지 필요에 따라 각각 독립적으로 크기를 조정하거나 수정할 수 있다는 것입니다.

<br>

📌 Backend Directory Structure

<BR>

<img src="https://user-images.githubusercontent.com/62149784/171850661-20db0797-2c6c-4f28-b00d-5527fb30da0d.jpg">

<br>

📌 TypeDI를 이용한 Service Layer 구축 코드

<br>

<img src="https://user-images.githubusercontent.com/62149784/171854008-55ad2bec-3152-4613-8967-bd2b749bdb8f.png">

<Br>

`출처` (https://charming-kyu.tistory.com/16)

<br>

### 1.2 배포 Architecture

---

<br>

<img src="https://user-images.githubusercontent.com/62149784/171851161-9f5caa3c-bf6d-47b5-84e2-c7813439f917.png">

<br>

AWS EC2 Instance에서 Docker 환경을 설정하고 Docker- Compose를 이용해 배포를 하였습니다.

<br>

Docker Container는 Reverse proxy를 담당하는 `Nginx Container`, 프론트와 백엔드 사이에서 통신을 하기위한 API 서버를 담당하는 `Node Container`, JWT를 통해 발급한 Refresh Token을 저장하는 `Redis Container` 3개로 이루어져 있습니다.

<br>

또한 보안을 향상시키기 위해 Let’s encrypt, certbot을 사용하여 `https` 적용하였습니다.

<br>

`Nginx Container`는 `Node Container` 앞 단에 위치하여 80번 포트로 들어오는 요청을 Nginx가 내부적으로 443포트로 redirect 하여 Node 컨테이너에 전달하고, 443포트로 들어오는 요청은 그대로 443포트로 Node 컨테이너에 전달하는 역할을 담당합니다.

<br>

`Nginx Container`가 Reverse Proxy 역할을 담당함으로써 http로 들어오는 요청을 redirect하여 https 요청으로 Node Container에 전달할 수 있습니다.

<br>

### 2. DATABASE

---

<BR>

- DB는 MongoDB 사용
 
 <br>

- Node.js와 MongoDB를 위한 ODM 라이브러리인 Mongoose 사용

<br>

### 2.1 데이터 모델링

---

<br>

<img src="https://user-images.githubusercontent.com/62149784/171812610-a17e25aa-7802-4a96-9217-496399a21a98.png">

<br>

### 2.2 Embedded MongoDB

---

<br>

저희 앱의 주요한 기능은 선한 영향력가게, 아동급식카드 가맹점 정보를 제공하는것 입니다.

<br>

그렇기 때문에 `Read API`의 `Response time`이 낮을 수록 좋을 것이며 API server의 `CRUD` 연산 작업 중 `R의 빈도`가 매우 높을 것이라고 판단하였습니다.

<br>

`Read performance`를 우선시하여 관계형데이터베이스와 비교했을 때 READ performance는 `Nesting > SQL > Aggregate` 순으로 나타났습니다.

<br>

그러므로 MongoDB의 `Embedded` 설계를 적절하게 활용하여 `Response Time` 을 최소화해 유저 경험을 높일 수 있다고 판단해 MongoDB를 선택하였습니다.

<br>

📌 Embedded 설계 예시

<br>

<img src="https://user-images.githubusercontent.com/62149784/171829888-dd4f4da9-2637-4567-a319-b50e74cc2f9f.png">

<br>

📌 서비스 내 구현 예시

<br>

<img src="https://user-images.githubusercontent.com/62149784/171830208-a6c6289d-ce49-4b05-8f92-0a08185ee50b.png">

<br>

✔ sunhans 테이블의 reviews 속성과 reviews 테이블 안에 writer 속성을 Embedded 방식으로 설계하여 선한 영향력 가게에 대한 정보, 감사 편지에 대한 정보, 감사 편지를 작성 한 유저 정보를 `한 번의 쿼리`를 통해 불러옴으로써 `DB 호출 횟수`를 줄여 `읽기 성능`을 `최적화`하고자 하였습니다.

<br>

### 2.3 공간 정보 인덱스

---

<br>

MongoDB에서 제공하는 `2dsphere` 인덱스와 `GeoJson` 형식을 사용하여 유저가 설정한 위치에서 가까운 곳부터 가맹점 정보를 제공하는 거리순 기능을 구현하였습니다.

<br>

📌 거리순 기능 구현 코드

<br>

<img src="https://user-images.githubusercontent.com/62149784/171848019-1592d4c0-75a7-4077-b528-59781e00f8a7.png">

<br>

<br>

📌 Postman test 수행 결과

<br>

✔ 유저의 위치가 경기대학교 종합강의동으로 설정되어있고, 해당 유저가 카테고리가 한식인 선한 영향력 가게 가맹점 중 거리가 가까운 순으로 데이터 받고자 합니다. 해당 기능을 담당하는 API를 Postman을 통해 테스트한 결과입니다.

<br>

<img src="https://user-images.githubusercontent.com/62149784/171848392-fdb83dd7-fcfd-4cb9-b5e7-02bc554a2e3a.jpg">

<br>

### 3. Response Time 최적화

---

<br>

Google 서버 응답시간 관련 자료에 따르면 서버 응답 시간을 200 ms 아래로 줄이는 것을 권장하고 있습니다. 서버의 응답시간을 줄이기 위해 했던 노력들을 소개하겠습니다.

<br>

`참고자료` (https://developers.google.com/speed/docs/insights/Server)

<br>

### 3.1 Promise.all() method를 통한 병렬처리

---

<br>

<img src="https://user-images.githubusercontent.com/62149784/171849369-38e7fa4c-77a9-4e12-a2dc-625515b3181a.png">

<br>

- DB 호출과 관련된 비즈니스 로직에서 순서가 보장되지 않아도 되는 것들은 Promise.all() method를 사용해 여러개의 비동기 처리를 병렬적으로 처리하였습니다.

- 비동기 작업들을 병렬적으로 처리하여 Response Time을 개선하였습니다.

<br>

📌 Promise.all 적용 코드

<br>

<img src="https://user-images.githubusercontent.com/62149784/171849606-89dc5bb6-10eb-4dd3-952c-882068c9881e.png">

<br>
 
 `참고자료` (https://code-masterjung.tistory.com/91)

### 3.2 Pagination

---

<br>

- `Pagination`이란 한정된 네트워크 자원을 효율적으로 활용하기 위해 쿼리의 결과값으로 리턴된 리소스를 분할하여 전달하는 것을 의미합니다.

<br>

📌 Pagination 적용 코드

<br>

<img src="https://user-images.githubusercontent.com/62149784/171852246-d6ca94f6-b3c9-4e9f-ae2d-c32bb0af6d68.png">

<br>

### 3.3 MongoDB $project

---

<BR>

MongoDB `$project`는 반환하려는 필드를 지정할 수 있는 query입니다.

<BR>

project을 사용하여 사용하지 않는 필드를 제거할 때 MongoDB 서버는 각 전체 문서를 메모리로 가져와 반환할 결과를 필터링해야 합니다.

<BR>

그러므로 project 사용은 MongoDB 서버의 메모리 사용량이나 working set을 줄이지는 않습니다.

<BR>

그러나 데이터 모델 및 예상 필드에 따라 쿼리 결과에 대해 상당한 네트워크 대역폭을 절약할 수 있습니다.

<br>

📌 MongoDB $project 적용 코드

<br>

<img src="https://user-images.githubusercontent.com/62149784/171853036-b38acc5e-cd51-4c38-ac1f-7bc85cd6e5c8.png">
