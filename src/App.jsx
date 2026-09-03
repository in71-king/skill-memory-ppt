import { useEffect, useMemo, useState } from 'react'
import {
  ArrowDown,
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Download,
  ExternalLink,
  FileCheck2,
  ImageIcon,
  Maximize2,
  MessageSquareText,
  ShieldCheck,
  Sparkles,
  X,
} from 'lucide-react'

const base = import.meta.env.BASE_URL

const templateSlides = Array.from({ length: 8 }, (_, index) => ({
  src: `template-${String(index + 1).padStart(2, '0')}.png`,
  label: `원본 Template ${index + 1} / 8`,
}))

const curriculumSlides = Array.from({ length: 19 }, (_, index) => ({
  src: `curriculum-${String(index + 1).padStart(2, '0')}.png`,
  label: `8시간 커리큘럼 ${index + 1} / 19`,
}))

const scenes = [
  {
    id: 'start',
    number: '01',
    label: 'START',
    date: '2026.08.18',
    title: '비슷하게 그린 PPT는 사내 Template이 아니었다',
    why: '색과 도형을 닮게 만드는 것만으로는 원본 Master, Layout, Logo, Footer가 보존되지 않았다.',
    user: '첨부된 파일은 사내 PPT 작성 Template이다. 이 Template으로 PPT를 만드는 Skill을 만들고 싶다.',
    userDownloads: [
      { label: '사업부 표준 PPT 템플릿 사본.pptx', href: 'files/corporate-template.pptx' },
    ],
    ai: '먼저 템플릿 구조와 모호한 운영 조건을 확인한 뒤 Skill Creator용 프롬프트를 설계하겠습니다.',
    changed: '“예쁜 PPT 생성”이 아니라 “원본 템플릿 안에서 작성”하는 문제로 재정의',
    tags: ['Template Fidelity', 'Before Skill', '2 Layouts'],
    result: {
      eyebrow: 'BEFORE SKILL',
      title: '스타일 모사형 초기 PPT',
      description: '내용 구성은 가능했지만 회사 Master·Layout을 사용하지 않은 별도 디자인이었다.',
      status: '문제 정의',
      images: [{ src: 'before-workflow.png', label: '비표준 디자인 예시' }],
    },
  },
  {
    id: 'questions',
    number: '02',
    label: 'QUESTIONS',
    date: '2026.08.19',
    title: '모호함을 일곱 개의 결정으로 분해했다',
    why: '“템플릿을 활용한다”는 말만으로는 고정 요소, 변형 범위, 승인 시점이 매번 달라질 수 있었다.',
    user: '원본 PPTX를 기반 파일로 쓸까? 고정 요소는 모두 유지할까? 본문 영역은 어디까지 바꿀 수 있을까?',
    ai: '원본 Base 사용, 고정 요소 보호, 필요할 때만 Agenda·Summary·Closing 사용, 본문 영역은 적응적으로 재배치하는 기준을 제안했습니다.',
    changed: '7개의 질문을 통해 Hard Constraint와 허용 변형 범위를 사용자 결정으로 확정',
    tags: ['Base PPTX', 'Fixed Frame', 'Adaptive Content'],
    result: {
      eyebrow: 'SOURCE OF TRUTH',
      title: '원본 표준 Template',
      description: '표지·Summary·본문·표·Closing을 포함한 8장의 실제 기준 파일.',
      status: '요구사항 확정',
      images: templateSlides,
    },
  },
  {
    id: 'master-prompt',
    number: '03',
    label: 'MASTER PROMPT',
    date: '2026.08.19',
    title: '질문에 대한 답을 하나의 Master Prompt로 묶었다',
    why: '대화에서 결정한 원칙이 장문의 요청 속에서 누락되지 않도록 실행 순서와 우선순위를 명시해야 했다.',
    user: '모든 Source를 허용하고, Source 디자인은 버리되 내용은 사내 Template으로 재해석한다. 제작 전 Outline 승인을 받는다.',
    ai: 'Source 분석 → Outline → 승인 → Layout Mapping → PPTX 제작 → Render·QA의 전체 Workflow로 정리했습니다.',
    changed: '자연어 요구를 반복 실행 가능한 Workflow와 승인 Gate로 변환',
    tags: ['Outline Gate', 'Source → Design', 'Render & QA'],
    result: {
      eyebrow: 'ADAPTIVE SUMMARY',
      title: '처음 정의한 Summary 기준',
      description: 'Summary가 핵심 레이아웃이지만, 당시에는 항목명이 고정되어 있었다.',
      status: 'Workflow 설계',
      images: [{ src: 'template-summary.png', label: '원본 Summary 구조' }],
    },
  },
  {
    id: 'analysis',
    number: '04',
    label: 'ANALYSIS',
    date: '2026.08.19',
    title: '템플릿을 이미지가 아니라 구조로 읽었다',
    why: '파일 내부 명칭과 실제 사용 목적이 달랐고, 일부 표는 Layout이 아니라 Slide-local 객체였다.',
    user: 'Skill 파일을 만들기 전에 Master, Layout, 객체, Font, Position, Color를 분석하고 결과를 먼저 보여줘.',
    ai: '16:9, 1 Master, 9 Layout, 8 Source Slides를 확인하고 Cover·Summary·General·Table·Closing Taxonomy를 만들었습니다.',
    changed: '눈대중 스타일 참조를 Layout Catalog와 Template Specification으로 전환',
    tags: ['1 Master', '9 Layouts', '8 Source Slides'],
    result: {
      eyebrow: 'TEMPLATE MAP',
      title: '8개 Source Slide Inventory',
      description: 'Layout 이름 대신 실제 Source Slide와 객체 구조를 함께 매핑했다.',
      status: '구조 분석 완료',
      images: [{ src: 'template-layouts.png', label: '템플릿 전체 레이아웃' }],
    },
  },
  {
    id: 'skill',
    number: '05',
    label: 'SKILL',
    date: '2026.08.19',
    title: '좋은 결과에 필요한 규칙을 하나의 Skill로 묶었다',
    why: '템플릿 파일만 보관해서는 제작 순서, 예외 처리, 검수 조건을 재현할 수 없었다.',
    user: '제안한 권장 기준으로 구현하고, 이 Skill을 내 ChatGPT에 저장해줘.',
    ai: '$corporate-template-ppt를 구현·등록하고 Outline Gate, 고정 요소 보호, 페이지 분모 갱신, Fidelity Gate를 연결했습니다.',
    changed: 'Template + Instructions + References + Assets + Scripts + QA Gate를 재사용 단위로 패키징',
    tags: ['Reusable Skill', 'Fidelity ≥92', 'Editable PPTX'],
    result: {
      eyebrow: 'SKILL PACKAGE',
      title: '규칙과 검사가 결합된 패키지',
      description: '기본 Presentation 기능 위에 회사 Template의 제작 규칙을 얹는 구조.',
      status: '최초 등록',
      images: [{ src: 'skill-package.png', label: 'Skill 구성 요소' }],
    },
  },
  {
    id: 'first-output',
    number: '06',
    label: 'FIRST OUTPUT',
    date: '2026.08.19',
    title: 'Template 적용은 성공했지만 읽기 품질은 흔들렸다',
    why: '원본 프레임을 지키는 데 집중하면서 11pt 본문, 고정 Summary, Text 중심 구성이 그대로 남았다.',
    user: '실제 기술자료와 8시간 커리큘럼을 이 Skill로 사내 표준 PPT로 만들어줘.',
    userDownloads: [
      { label: 'AI_Essential_8시간_커리큘럼_심층리서치.pptx', href: 'files/ai-essential-8h-curriculum.pptx' },
    ],
    ai: '원본 Master와 9개 Layout을 유지한 결과물을 만들었지만, 최신 검사 기준에서는 작은 본문이 발견됩니다.',
    changed: 'Template Fidelity만 높아도 좋은 발표자료가 되는 것은 아니라는 실제 증거 확보',
    tags: ['Template Applied', '11pt Body', 'Text Heavy'],
    result: {
      eyebrow: 'EARLY OUTPUTS',
      title: '8시간 커리큘럼 전체 결과',
      description: '전체 19장을 넘겨보며 Template Fidelity와 초기 가독성 문제를 함께 확인할 수 있다.',
      status: '개선 필요',
      images: curriculumSlides,
      downloads: [
        { label: '8시간 커리큘럼 PPTX', href: 'files/ai-essential-8h-curriculum.pptx' },
      ],
    },
  },
  {
    id: 'diagnosis',
    number: '07',
    label: 'DIAGNOSIS',
    date: '2026.08.20',
    title: '11.25pt 본문이 실제로는 4–8pt까지 축소됐다',
    why: '작성자가 지정한 글꼴 크기만 검사하고 PowerPoint AutoFit 배율을 읽지 않아 오류를 놓쳤다.',
    user: '슬라이드 7, 8, 9의 본문이 매우 작다. 왜 발생하는지 분석하고 수정해라.',
    ai: '11.25pt에 normAutofit이 추가 적용되어 실효 크기가 약 4.15pt, 8.31pt, 6.96pt가 된 것을 확인했습니다.',
    changed: 'Typography 검사를 authored font가 아닌 effective font 기준으로 변경',
    tags: ['AutoFit Audit', '4.15pt', 'Root Cause'],
    result: {
      eyebrow: 'FAILURE EVIDENCE',
      title: '보이는 오류를 수치로 설명',
      description: '빈 공간은 남아 있는데 좁은 Text Box만 자동 축소된 것이 핵심 원인이었다.',
      status: '원인 확정',
      images: curriculumSlides.slice(6, 9),
    },
  },
  {
    id: 'rules',
    number: '08',
    label: 'RULES',
    date: '2026.08.20–24',
    title: '사용자 피드백을 자동 검사 가능한 규칙으로 바꿨다',
    why: '“유연하게”, “너무 작지 않게”, “시각적으로” 같은 표현은 검사기가 동일하게 판단할 수 없었다.',
    user: 'Summary 항목을 편집 가능하게 하고, 표는 1–3열로 유연하게 구성하며, 본문 12pt와 Figure·Footer QA를 통일해줘.',
    ai: 'Adaptive Summary, 12pt 최소값, 가변 표, Figure Crop, Footer 보호영역, 구조→기계→시각 QA를 영구 규칙으로 반영했습니다.',
    changed: '주관적 품질 요구를 좌표·크기·단계·통과 조건이 있는 QA Gate로 변환',
    tags: ['Body ≥12pt', '1–3 Columns', '3-stage QA'],
    result: {
      eyebrow: 'PERMANENT RULES',
      title: '고정 Layout이 만든 두 가지 문제',
      description: '슬라이드 2는 마스터에 고정된 Summary 항목명을 바꿀 수 없어 본문에 요약 제목을 다시 넣었다. 슬라이드 10은 입력량과 무관하게 큰 표 영역을 유지해 공간을 비효율적으로 사용했다.',
      status: 'QA 강화',
      images: [
        { ...curriculumSlides[1], label: '슬라이드 2 · 고정 Summary 항목명', note: '고정된 좌측 제목과 실제 요약 내용이 맞지 않아 본문에 별도 제목이 중복됐다.' },
        { ...curriculumSlides[9], label: '슬라이드 10 · 과도하게 큰 Table', note: '내용이 적어도 표 크기와 레이아웃이 고정되어 슬라이드 공간을 충분히 활용하지 못했다.' },
      ],
    },
  },
  {
    id: 'font',
    number: '09',
    label: 'PREFLIGHT',
    date: '2026.08.26',
    title: '한글 렌더링 실패를 제작 중단이 아닌 환경 규칙으로 해결했다',
    why: '실행 환경에 맑은 고딕이 없으면 PPT 내용은 정상이어도 미리보기에서 한글이 깨질 수 있었다.',
    user: 'PPT 내부 글꼴은 맑은 고딕으로 유지하면서 렌더링용 폰트 문제 때문에 제작이 중단되지 않게 해줘.',
    ai: 'Noto Sans KR Regular·Bold를 Skill에 포함하고, 임시 Fontconfig를 미리보기 렌더링에만 자동 연결했습니다.',
    changed: 'PPTX의 맑은 고딕 선언과 검수용 대체 렌더링을 분리해 재현성을 확보',
    tags: ['Malgun Gothic', 'Noto Sans KR', 'Preflight'],
    result: {
      eyebrow: 'RENDER VERIFIED',
      title: '같은 슬라이드, 다른 렌더링 환경',
      description: 'PPT 내부 글꼴은 맑은 고딕으로 유지하면서 미리보기 렌더링에만 Noto Sans KR을 연결했다.',
      status: '한글 정상',
      images: [
        { src: 'font-before.png', label: 'Before · 맑은 고딕 미설치', note: '맑은 고딕을 사용할 수 없는 환경에서 한글 자소가 누락된 잘못된 미리보기.' },
        { src: 'font-after.png', label: 'After · Noto Sans KR 적용', note: '렌더 전용 fallback 적용 후 같은 슬라이드의 한글이 정상 출력된다.' },
      ],
    },
  },
  {
    id: 'outcome',
    number: '10',
    label: 'OUTCOME',
    date: '2026.08.24–27',
    title: '하나의 Skill을 논문·특허·강의교안에 반복 적용했다',
    why: '좋은 Skill인지 판단하려면 한 가지 예제가 아니라 성격이 다른 Source에서도 동일한 품질 규칙이 작동해야 했다.',
    user: '논문, 특허, AI 강의교안을 같은 사내 Template으로 각각 제작해줘.',
    ai: 'Source Figure와 기술 논리를 보존하면서 Adaptive Summary, 시각자료, Speaker Notes, QA를 포함한 편집 가능한 PPTX를 제작했습니다.',
    changed: '일회성 Prompt가 다양한 업무를 같은 기준으로 처리하는 재사용 가능한 제작 시스템으로 완성',
    tags: ['Paper', 'Patent', 'Lecture'],
    result: {
      eyebrow: 'LIVE PORTFOLIO',
      title: '세 가지 Source, 하나의 제작 방식',
      description: '논문·특허·강의교안이 동일한 Corporate Design Grammar 안에서 서로 다른 정보 구조를 갖는다.',
      status: '최종 활용',
      images: [
        { src: 'final-paper.png', label: '논문 소개' },
        { src: 'final-patent.png', label: '특허 소개' },
        { src: 'final-lecture.png', label: 'AI 강의교안' },
      ],
      downloads: [
        { label: '논문 소개 PPTX', href: 'files/kim-2018-topological-phononics.pptx' },
        { label: '특허 소개 PPTX', href: 'files/us12322656b2-extreme-laser-lift-off.pptx' },
        { label: 'AI 강의교안 PPTX', href: 'files/chatgpt-productivity-2h-lecture.pptx' },
      ],
    },
  },
]

const chatLinks = [
  {
    label: '프롬프트 설계 대화',
    href: 'https://chatgpt.com/share/6a98346f-4f40-83e9-987f-e911d4a0a488',
  },
  {
    label: 'Skill 제작·개선 대화',
    href: 'https://chatgpt.com/share/6a983464-4cb0-83ee-a0fa-c7774ccd1f21',
  },
]

function ResultCard({ result, onOpen }) {
  const [imageIndex, setImageIndex] = useState(0)

  useEffect(() => setImageIndex(0), [result])

  const current = result.images[imageIndex]
  const previous = () => setImageIndex((index) => (index - 1 + result.images.length) % result.images.length)
  const next = () => setImageIndex((index) => (index + 1) % result.images.length)

  return (
    <article className="result-card">
      <div className="result-card__head">
        <div>
          <span className="micro-label">{result.eyebrow}</span>
          <h3>{result.title}</h3>
        </div>
        <span className="status-pill"><Check size={13} /> {result.status}</span>
      </div>

      <button
        className="slide-preview"
        type="button"
        onClick={() => onOpen(current)}
        aria-label={`${current.label} 크게 보기`}
      >
        <img src={`${base}slides/${current.src}`} alt={current.label} />
        <span className="zoom-hint"><Maximize2 size={15} /> 크게 보기</span>
      </button>

      {result.images.length > 1 && (
        <div className="carousel-controls" aria-label="슬라이드 넘기기">
          <button type="button" onClick={previous} aria-label="이전 슬라이드"><ChevronLeft size={17} /></button>
          <span><b>{imageIndex + 1}</b> / {result.images.length}<small>{current.label}</small></span>
          <button type="button" onClick={next} aria-label="다음 슬라이드"><ChevronRight size={17} /></button>
        </div>
      )}

      <p>{current.note || result.description}</p>
      {result.downloads?.length > 0 && (
        <div className="download-list">
          {result.downloads.map((file) => (
            <a key={file.href} href={`${base}${file.href}`} download>
              <Download size={14} /> {file.label}
            </a>
          ))}
        </div>
      )}
      <div className="result-meta">
        <ImageIcon size={15} /> 실제 Library PPTX 전체 해상도 렌더
      </div>
    </article>
  )
}

function Scene({ scene, index, onOpen }) {
  return (
    <section className="scene" id={scene.id} data-scene={index}>
      <div className="scene__marker">{scene.number}</div>
      <div className="scene__copy">
        <div className="scene__eyebrow">
          <span>{scene.label}</span>
          <span>{scene.date}</span>
        </div>
        <h2>{scene.title}</h2>

        <div className="why-box">
          <span>왜 다음 지시가 필요했나</span>
          <p>{scene.why}</p>
        </div>

        <div className="message message--user">
          <div className="avatar avatar--user">나</div>
          <div>
            <span className="message__role">사용자</span>
            <p>{scene.user}</p>
            {scene.userDownloads?.map((file) => (
              <a className="message-download" key={file.href} href={`${base}${file.href}`} download>
                <Download size={14} /> {file.label} 다운로드
              </a>
            ))}
          </div>
        </div>

        <div className="message message--ai">
          <div className="avatar avatar--ai">AI</div>
          <div>
            <span className="message__role">ChatGPT</span>
            <p>{scene.ai}</p>
          </div>
        </div>

        <div className="change-box">
          <ArrowRight size={20} />
          <div>
            <span>이 대화가 바꾼 것</span>
            <strong>{scene.changed}</strong>
          </div>
        </div>

        <div className="tag-row">
          {scene.tags.map((tag) => <span key={tag}><Check size={13} /> {tag}</span>)}
        </div>

        <div className="mobile-result">
          <ResultCard result={scene.result} onOpen={onOpen} />
        </div>
      </div>
    </section>
  )
}

function App() {
  const [active, setActive] = useState(0)
  const [modalImage, setModalImage] = useState(null)
  const progress = useMemo(() => ((active + 1) / scenes.length) * 100, [active])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible) setActive(Number(visible.target.dataset.scene))
      },
      { rootMargin: '-28% 0px -55% 0px', threshold: [0.05, 0.2, 0.5] },
    )

    document.querySelectorAll('[data-scene]').forEach((node) => observer.observe(node))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const close = (event) => event.key === 'Escape' && setModalImage(null)
    window.addEventListener('keydown', close)
    return () => window.removeEventListener('keydown', close)
  }, [])

  const goTo = (index) => {
    document.getElementById(scenes[index].id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <>
      <header className="topbar">
        <a className="brand" href="#top" aria-label="페이지 처음으로">
          <span>CTP</span>
          <strong>Skill 제작기</strong>
        </a>
        <div className="topbar__progress" aria-label={`전체 진행률 ${Math.round(progress)}%`}>
          <span style={{ width: `${progress}%` }} />
        </div>
        <div className="chat-links">
          {chatLinks.map((link) => (
            <a key={link.href} href={link.href} target="_blank" rel="noreferrer">
              {link.label}<ExternalLink size={13} />
            </a>
          ))}
        </div>
      </header>

      <main id="top">
        <section className="hero">
          <div className="hero__copy">
            <span className="micro-label">A REAL SKILL-BUILDING STORY</span>
            <h1>
              <span>“이 Template으로</span>
              <span>만들어줘”가 <em>검증 가능한</em></span>
              <span><em>제작 시스템</em>이 되기까지</span>
            </h1>
            <p>실제 ChatGPT 대화와 PPT 결과물을 따라가며, 하나의 사내 템플릿이 실패·진단·규칙화를 거쳐 재사용 가능한 Skill로 발전하는 과정을 읽어보세요.</p>
            <button type="button" className="primary-button" onClick={() => goTo(0)}>
              제작 과정 시작하기 <ArrowDown size={18} />
            </button>
          </div>

          <div className="hero__visual" aria-label="제작기 핵심 숫자">
            <div className="orbit orbit--one" />
            <div className="orbit orbit--two" />
            <div className="hero-core"><strong>10</strong><span>대화 장면</span></div>
            <div className="metric metric--one"><strong>1</strong><span>Master</span></div>
            <div className="metric metric--two"><strong>9</strong><span>Layouts</span></div>
            <div className="metric metric--three"><strong>3</strong><span>QA Stages</span></div>
          </div>

          <div className="how-to">
            <strong>읽는 방법</strong>
            <span><b>01</b> 실제 대화를 따라 스크롤합니다.</span>
            <span><b>02</b> 피드백이 규칙으로 변하는 과정을 봅니다.</span>
            <span><b>03</b> 실제 PPT 결과를 열어 비교합니다.</span>
          </div>
        </section>

        <nav className="stage-nav" aria-label="제작 단계">
          {scenes.map((scene, index) => (
            <button
              key={scene.id}
              type="button"
              onClick={() => goTo(index)}
              className={active === index ? 'is-active' : ''}
              aria-current={active === index ? 'step' : undefined}
            >
              <b>{scene.number}</b>
              <span>{scene.label}</span>
            </button>
          ))}
        </nav>

        <div className="story-shell">
          <div className="story-column">
            {scenes.map((scene, index) => (
              <Scene key={scene.id} scene={scene} index={index} onOpen={setModalImage} />
            ))}
          </div>

          <aside className="live-column">
            <div className="live-label">
              <span>LIVE RESULT</span>
              <span>{active + 1} / {scenes.length}</span>
            </div>
            <ResultCard result={scenes[active].result} onOpen={setModalImage} />
            <div className="completion">
              <span>Skill 완성도</span><b>{Math.round(progress)}%</b>
              <div><span style={{ width: `${progress}%` }} /></div>
            </div>
          </aside>
        </div>

        <section className="finale">
          <span className="micro-label">WHAT CHANGED</span>
          <h2>좋은 Skill은 긴 Prompt가 아니라<br />관찰 가능한 피드백 루프에서 나온다.</h2>
          <div className="finale-grid">
            <article>
              <MessageSquareText />
              <span>처음</span>
              <h3>요구사항</h3>
              <p>사내 Template으로 PPT를 만들어주는 기능</p>
            </article>
            <article>
              <FileCheck2 />
              <span>중간</span>
              <h3>제작 규칙</h3>
              <p>Outline, Layout Mapping, Adaptive Content</p>
            </article>
            <article>
              <ShieldCheck />
              <span>완성</span>
              <h3>검증 시스템</h3>
              <p>Preflight, Typography, Figure, Footer, Visual QA</p>
            </article>
            <article>
              <Sparkles />
              <span>결과</span>
              <h3>반복 가능한 Skill</h3>
              <p>논문·특허·강의교안을 편집 가능한 PPTX로 변환</p>
            </article>
          </div>
          <a href="#top" className="back-top">처음으로 ↑</a>
        </section>
      </main>

      <footer>
        <strong>Corporate Template PPT Skill Story</strong>
        <span>실제 공유 대화 및 Library PPTX 기반 · 2026</span>
      </footer>

      {modalImage && (
        <div className="modal" role="dialog" aria-modal="true" aria-label={`${modalImage.label} 확대 이미지`}>
          <button className="modal__backdrop" type="button" onClick={() => setModalImage(null)} aria-label="닫기" />
          <div className="modal__content">
            <div className="modal__head">
              <div><span className="micro-label">ACTUAL PPT OUTPUT</span><h3>{modalImage.label}</h3></div>
              <button type="button" onClick={() => setModalImage(null)} aria-label="닫기"><X /></button>
            </div>
            <img src={`${base}slides/${modalImage.src}`} alt={modalImage.label} />
            <p>실제 PPTX를 전체 해상도로 렌더링한 화면입니다. SAMSUNG Logo, Confidential, Footer는 원본 그대로 표시했습니다.</p>
          </div>
        </div>
      )}
    </>
  )
}

export default App
