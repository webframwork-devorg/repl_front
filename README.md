# 💜 re:pl 💜

> **React와 Vite를 활용한 프론트엔드 프로젝트**

이 프로젝트는 최신 React v19와 Vite v7을 기반으로 구축된 웹 애플리케이션입니다. 빠르고 효율적인 개발 환경을 구성하고, Supabase를 활용한 백엔드 연동 및 Tailwind CSS를 이용한 스타일링을 적용하였습니다.

<br>

## 📚 목차
1. [배포 주소](#-배포-주소)
2. [프로젝트 소개](#-프로젝트-소개)
3. [팀 소개](#-팀-소개)
4. [사용 기술 스택](#-사용-기술-스택)
5. [실행 환경 및 방법](#-실행-환경-및-방법)
6. [주요 기능](#-주요-기능)
7. [서비스 구성](#-서비스-구성)
<br>

## 💾 배포 주소

https://replsite.netlify.app/

<br>

## 🎀 프로젝트 소개

**"나만의 서재를 음악 플레이리스트처럼."**

`repl_front`는 음악 플레이리스트처럼 **자신의 책 취향을 담고 공유할 수 있는 웹 애플리케이션**입니다.
React v19와 Supabase를 기반으로 구축되었으며, 사용자는 태그를 통해 책을 큐레이팅하여 자신만의 '북 플레이리스트'를 생성할 수 있습니다.

**주요 특징:**
* 📚 **북 플레이리스트:** 좋아하는 책들을 테마별로 묶어 관리하고 공유합니다.
* 🤝 **취향 공유:** 다른 사용자의 리스트를 구경하고, 하트(좋아요)와 태그를 통해 소통합니다.
* ⚡ **최신 기술 스택:** Vite와 Zustand를 활용한 빠르고 쾌적한 사용자 경험을 제공합니다.

<br>

## 🌍 팀 소개

* 2171384 공지현, 2071403 권민서, 2171445 나윤서, 2271436 조 은

<br>

## 🏝 사용 기술 스택

### Environment & Tools
![Visual Studio Code](https://img.shields.io/badge/Visual%20Studio%20Code-007ACC?style=for-the-badge&logo=Visual%20Studio%20Code&logoColor=white)
![Git](https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=Git&logoColor=white)
![Github](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=GitHub&logoColor=white)

### Development
![React](https://img.shields.io/badge/React_v19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite_v7-646CFF?style=for-the-badge&logo=Vite&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-State-orange?style=for-the-badge)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_v4-06B6D4?style=for-the-badge&logo=Tailwind-CSS&logoColor=white)

### API & Testing
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white)
![Vitest](https://img.shields.io/badge/Vitest-Testing-green?style=for-the-badge)
![Playwright](https://img.shields.io/badge/Playwright-E2E-green?style=for-the-badge&logo=playwright&logoColor=white)

### Libraries
- **UI/Docs:** `Storybook`, `react-icons`, `@fontsource/inter`
- **Routing:** `react-router-dom`
- **Linting:** `ESLint`

<br>

## 🛠 실행 환경 및 방법

이 프로젝트는 로컬 환경에서 실행하기 위해 다음과 같은 절차가 필요합니다.

### 1. 실행 환경 (Prerequisites)
* **Node.js**: `v18.0.0` 이상 (Vite 실행을 위해 최신 LTS 버전 권장)
* **npm**: Node.js 설치 시 함께 설치됩니다.

### 2. 환경 변수 설정 (Environment Variables) & DB 연결
이 프로젝트는 **Supabase(클라우드 DB)**를 사용하므로 로컬에 별도의 DB를 설치할 필요가 없습니다. 단, API 키 설정이 필요합니다.

* **방법**
  - 루트 디렉토리에 포함된 `.env` 파일이 존재하는지 확인해주세요.
  -  해당 파일에 DB 연결 정보가 미리 설정되어 있습니다.
  - 프로젝트 루트 경로에 .env 압축을 해제해주세요.

### 설치 (Installation)

프로젝트 루트 경로에서 의존성 패키지를 설치합니다.
```bash
# 저장소 클론
git clone https://github.com/webframwork-devorg/repl_front.git

# 프로젝트 폴더로 이동
cd repl_front

# 의존성 패키지 설치
npm install

# 프로젝트 빌드
npm run build

# 프로젝트 실행
npm start 또는 npm run dev
```

<br>

## 📲 주요 기능

- **북 플레이리스트 게시 기능**: 사용자는 감명 깊은 책의 구절이나 나만의 책 취향을 담은 플레이리스트를 생성하고 웹에 게시할 수 있습니다.

- **플레이리스트 & 책 추가**: 플로팅 메뉴를 통해 자신의 플레이리스트를 추가하거나, 플레이리스트에 책을 추가할 수 있습니다.

- **맞춤형 정렬 및 필터 기능**: 다양한 태그와 정렬 옵션을 제공하여, 사용자가 원하는 분위기나 주제의 책 플레이리스트를 쉽게 찾을 수 있도록 돕습니다.

- **공감(좋아요) 기능**: 마음에 드는 플레이리스트에 하트 버튼을 눌러 즉각적인 반응을 보일 수 있으며, 사용자 간의 취향 공유를 활성화합니다.

- **소셜 공유 기능**: Web Share API를 활용하여 모바일에서는 카카오톡 등 메신저로 바로 공유하고, PC에서는 URL 복사를 통해 손쉽게 친구들에게 플레이리스트를 전달할 수 있습니다.

- **로그인 및 세션 관리**: Supabase 인증을 통해 회원가입과 로그인을 지원하며, 자동 세션 관리를 통해 끊김 없는 사용자 경험을 제공합니다.

<br>

## 📲 서비스 구성
---
### AuthPage (주소: /auth)
- 페이지에 처음 접속하게 되면 카카오 api를 사용하여 구현한 로그인 기능을 수행합니다.
<img width="200" height="500" alt="image" src="https://github.com/user-attachments/assets/03cb2a71-4be5-41c3-a800-9dddd0f1836f" />

--- 
### LandingPage (주소: /)
- 각 플레이리스트에 담긴 책의 분위기와 포함된 태그, 좋아요 수를 한눈에 확인할 수 있습니다.
- 전반적인 북 플레이리스트들을 인기순, 최신순으로 나누어 확인할 수 있습니다.
- 인기순은 유저들이 누른 **좋아요(하트)**의 전체 개수를 기준으로 정렬되었고, 최신순은 사용자가 플레이리스트를 생성한 시간을 기준으로 정렬되었습니다.
- 플로팅메뉴를 통해 플레이리스트, 책을 추가할 수 있습니다. 
<img width="200" height="500" alt="image" src="https://github.com/user-attachments/assets/1ac0c75b-58e4-40d6-b5de-2cdeb799f788" />

---
### ListPage (주소: /list/{id})
- 플레이리스트 상세 페이지를 볼 수 있습니다.
- 드롭다운 메뉴를 이용해 플레이리스트의 책을 **'최신순/인기순/제목순'**으로 정렬하거나, **'태그(Tag)'**를 선택하여 원하는 분위기의 책들을 선별해 볼 수 있습니다.
- 다른 사용자들이 공유한 북 플레이리스트를 카드 형태로 직관적으로 확인할 수 있습니다.
- 각 카드는 썸네일 이미지와 제목을 포함하여 시각적인 즐거움을 제공합니다.
- 좋아요 기능을 통해 마음에 드는 플레이리스트를 발견하면 카드 하단의 하트 아이콘을 클릭하여 즉각적으로 공감을 표현할 수 있습니다.
- 공유 버튼을 눌러 원하는 사용자에게 플레이리스트를 공유할 수 있습니다. 
<img width="200" height="500" alt="image" src="https://github.com/user-attachments/assets/aa92690c-9d79-443b-99c0-5dea84d6db40" />

---
### BookPage (주소: /list/{id}/book/{id})
- 플레이리스트에 담긴 책의 상세 내용을 볼 수 있습니다.
- 책의 사진을 누르면 제목, 작가, 별점, 읽은 날짜, 태그 등을 확인할 수 있습니다. 
- 좋아요 기능을 통해 마음에 드는 책이라면, 카드 하단의 하트 아이콘을 클릭하여 즉각적으로 공감을 표현할 수 있습니다.
- 책갈피의 갯수를 확인하고, + 버튼을 통해 책갈피를 추가할 수 있습니다. 
<img width="200" height="500" alt="image" src="https://github.com/user-attachments/assets/61628187-aabe-4db9-ad8f-75f39a97b2dc" />
<img width="200" height="500" alt="image" src="https://github.com/user-attachments/assets/6b8ad28f-a132-46aa-8aba-5082ce6eef56" />

---
### AddBookPage (주소: /book/add)
- 사용자가 소유한 플레이리스트에 책을 추가할 수 있습니다.
- Google Books APIs를 사용하여 책을 검색하여 자동으로 대표사진, 작가, 제목을 가져올 수 있습니다.
- 만약 사용자가 직접 작성하길 원한다면, 사용자가 원하는 책을 수동으로 추가할 수 있습니다.
- 한줄평, 읽은 날짜, 별점을 작성하여 추가합니다. 
<img width="200" height="500" alt="image" src="https://github.com/user-attachments/assets/9f226cc7-d4bc-4fb7-84a3-97f0b2bd5718" />
<img width="200" height="500" alt="image" src="https://github.com/user-attachments/assets/58d130bc-ccc9-43d2-9a7b-6ac1b5a476e2" />

---
### AddListPage (주소: /edit/list)
- 사용자가 원하는 플레이리스트를 추가합니다.
- 제목, 태그, 대표사진, 한줄평을 작성하여 원하는 대표 사진으로 플레이리스트를 생성합니다. 
<img width="200" height="500" alt="image" src="https://github.com/user-attachments/assets/c9ce7520-0d68-4836-9bbf-41d4abe92192" />


