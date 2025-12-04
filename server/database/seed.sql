DELETE FROM policies;
INSERT INTO policies (id, title, category, age_min, age_max, income_limit, region, benefit_summary, description, apply_url) VALUES (
    '1',
    '청년월세 특별지원',
    'housing',
    19,
    34,
    NULL,
    '전국',
    '매달 20만 원씩 최대 12개월간 월세 지원',
    '부모님과 별도로 거주하는 무주택 청년에게 월세를 지원하여 주거비 부담을 덜어드립니다.',
    'https://www.bokjiro.go.kr'
  );
INSERT INTO policies (id, title, category, age_min, age_max, income_limit, region, benefit_summary, description, apply_url) VALUES (
    '2',
    '청년도약계좌',
    'finance',
    19,
    34,
    NULL,
    '전국',
    '5년 만기 시 최대 5,000만 원 목돈 마련',
    '청년의 중장기 자산 형성을 돕기 위해 정부 기여금과 비과세 혜택을 제공합니다.',
    'https://ylaccount.kinfa.or.kr'
  );
INSERT INTO policies (id, title, category, age_min, age_max, income_limit, region, benefit_summary, description, apply_url) VALUES (
    '3',
    '국민취업지원제도',
    'job',
    15,
    69,
    NULL,
    '전국',
    '구직촉진수당 최대 300만 원 (월 50만 원 × 6개월)',
    '취업을 원하는 분들에게 취업지원서비스를 종합적으로 제공하고, 저소득 구직자에게는 생계를 위한 최소한의 소득도 지원합니다.',
    'https://www.kua.go.kr'
  );
INSERT INTO policies (id, title, category, age_min, age_max, income_limit, region, benefit_summary, description, apply_url) VALUES (
    '4',
    '경기도 청년기본소득',
    'cash',
    24,
    24,
    NULL,
    '경기도',
    '분기별 25만 원, 연간 최대 100만 원 지급',
    '경기도에 거주하는 만 24세 청년에게 조건 없이 지급하는 기본소득입니다.',
    'https://apply.jobaba.net'
  );
INSERT INTO policies (id, title, category, age_min, age_max, income_limit, region, benefit_summary, description, apply_url) VALUES (
    '5',
    '서울시 청년수당',
    'cash',
    19,
    34,
    NULL,
    '서울',
    '매월 50만 원 × 최대 6개월 지원',
    '서울에 거주하는 미취업 청년에게 구직 활동 및 생계비를 지원합니다.',
    'https://youth.seoul.go.kr'
  );
INSERT INTO policies (id, title, category, age_min, age_max, income_limit, region, benefit_summary, description, apply_url) VALUES (
    '6',
    '청년주택드림 청약통장',
    'housing',
    19,
    34,
    NULL,
    '전국',
    '최대 4.5% 금리, 청약 당첨 시 저금리 대출 연계',
    '청년의 내 집 마련을 돕기 위해 높은 금리와 대출 연계 혜택을 제공하는 청약통장입니다.',
    'https://nhuf.molit.go.kr'
  );
INSERT INTO policies (id, title, category, age_min, age_max, income_limit, region, benefit_summary, description, apply_url) VALUES (
    '7',
    '중소기업 취업청년 전월세보증금 대출',
    'housing',
    19,
    34,
    NULL,
    '전국',
    '연 1.5% 금리로 최대 1억 원까지 전월세 보증금 대출',
    '중소기업에 재직 중인 청년에게 저금리로 전월세 보증금을 대출해드립니다.',
    'https://nhuf.molit.go.kr'
  );
INSERT INTO policies (id, title, category, age_min, age_max, income_limit, region, benefit_summary, description, apply_url) VALUES (
    '8',
    '청년 전용 버팀목 전세자금 대출',
    'housing',
    19,
    34,
    NULL,
    '전국',
    '연 1.8%~2.7% 금리로 최대 2억 원까지 대출',
    '전세 자금이 부족한 청년들에게 저금리로 자금을 지원합니다.',
    'https://nhuf.molit.go.kr'
  );
INSERT INTO policies (id, title, category, age_min, age_max, income_limit, region, benefit_summary, description, apply_url) VALUES (
    '9',
    '청년 우대형 주택청약종합저축',
    'housing',
    19,
    34,
    NULL,
    '전국',
    '최대 3.3% 금리 및 비과세 혜택 제공',
    '기존 주택청약종합저축의 청약 기능과 소득공제 혜택은 그대로 유지하면서 재형 기능을 강화했습니다.',
    'https://nhuf.molit.go.kr'
  );
INSERT INTO policies (id, title, category, age_min, age_max, income_limit, region, benefit_summary, description, apply_url) VALUES (
    '10',
    '행복주택 공급',
    'housing',
    19,
    39,
    NULL,
    '전국',
    '시세의 60~80% 수준으로 공공임대주택 공급',
    '대학생, 청년, 신혼부부 등을 위해 직장과 학교가 가까운 곳에 저렴하게 공급하는 공공임대주택입니다.',
    'https://apply.lh.or.kr'
  );
INSERT INTO policies (id, title, category, age_min, age_max, income_limit, region, benefit_summary, description, apply_url) VALUES (
    '11',
    '서울시 역세권 청년주택',
    'housing',
    19,
    39,
    NULL,
    '서울',
    '대중교통이 편리한 역세권에 저렴한 임대주택 공급',
    '서울시가 민간과 협력하여 역세권에 공급하는 청년 맞춤형 임대주택입니다.',
    'https://soco.seoul.go.kr'
  );
INSERT INTO policies (id, title, category, age_min, age_max, income_limit, region, benefit_summary, description, apply_url) VALUES (
    '12',
    '경기도 청년 기본주택',
    'housing',
    19,
    39,
    NULL,
    '경기도',
    '무주택자 누구나 적정 임대료로 30년 이상 거주 가능',
    '경기도가 추진하는 보편적 주거서비스로, 소득과 자산에 관계없이 입주할 수 있습니다.',
    'https://gh.or.kr'
  );
INSERT INTO policies (id, title, category, age_min, age_max, income_limit, region, benefit_summary, description, apply_url) VALUES (
    '13',
    '청년 이사비 지원',
    'housing',
    19,
    39,
    NULL,
    '서울',
    '이사비 및 중개보수 최대 40만 원 지원',
    '서울로 이사 오거나 서울 내에서 이사하는 청년의 주거비 부담을 덜어드립니다.',
    'https://youth.seoul.go.kr'
  );
INSERT INTO policies (id, title, category, age_min, age_max, income_limit, region, benefit_summary, description, apply_url) VALUES (
    '14',
    '전세보증금 반환보증 보증료 지원',
    'housing',
    19,
    39,
    NULL,
    '전국',
    '최대 30만 원 보증료 지원',
    '전세 사기 피해 예방을 위해 전세보증금 반환보증 가입 시 납부한 보증료를 지원합니다.',
    'https://www.gov.kr'
  );
INSERT INTO policies (id, title, category, age_min, age_max, income_limit, region, benefit_summary, description, apply_url) VALUES (
    '15',
    '희망두배 청년통장',
    'finance',
    18,
    34,
    NULL,
    '서울',
    '본인 저축액의 100%를 서울시가 매칭 지원 (최대 1,080만 원)',
    '일하는 청년이 꾸준히 저축하면 서울시가 동일한 금액을 적립해주는 자산 형성 지원 사업입니다.',
    'https://account.welfare.seoul.kr'
  );
INSERT INTO policies (id, title, category, age_min, age_max, income_limit, region, benefit_summary, description, apply_url) VALUES (
    '16',
    '경기도 청년 노동자 통장',
    'finance',
    18,
    34,
    NULL,
    '경기도',
    '2년 만기 시 최대 580만 원 (현금 480만 원 + 지역화폐 100만 원)',
    '경기도 거주 청년 노동자가 매달 10만 원을 저축하면 2년 후 목돈을 마련할 수 있도록 지원합니다.',
    'https://account.jobaba.net'
  );
INSERT INTO policies (id, title, category, age_min, age_max, income_limit, region, benefit_summary, description, apply_url) VALUES (
    '17',
    '청년내일채움공제',
    'finance',
    15,
    34,
    NULL,
    '전국',
    '2년 만기 시 1,200만 원 목돈 마련 (본인 300만 원 + 기업/정부 지원)',
    '중소기업에 정규직으로 취업한 청년의 장기 근속과 자산 형성을 지원합니다.',
    'https://www.work.go.kr/youngtomorrow'
  );
INSERT INTO policies (id, title, category, age_min, age_max, income_limit, region, benefit_summary, description, apply_url) VALUES (
    '18',
    '장병내일준비적금',
    'finance',
    18,
    28,
    NULL,
    '전국',
    '전역 시 최대 1,000만 원 목돈 마련 (매칭지원금 포함)',
    '군 복무 중인 병사들이 전역 후 사회 진출을 위한 목돈을 마련할 수 있도록 돕습니다.',
    'https://www.mnd.go.kr'
  );
INSERT INTO policies (id, title, category, age_min, age_max, income_limit, region, benefit_summary, description, apply_url) VALUES (
    '19',
    '햇살론 유스',
    'finance',
    19,
    34,
    NULL,
    '전국',
    '연 3.5% 금리로 최대 1,200만 원 생활비 대출',
    '대학생, 미취업 청년, 사회초년생 등에게 저금리로 생활 자금을 지원합니다.',
    'https://www.kinfa.or.kr'
  );
INSERT INTO policies (id, title, category, age_min, age_max, income_limit, region, benefit_summary, description, apply_url) VALUES (
    '20',
    '학자금 대출 이자 지원',
    'finance',
    19,
    39,
    NULL,
    '각 지자체',
    '한국장학재단 학자금 대출 이자 전액 또는 일부 지원',
    '각 지자체별로 거주 대학생 및 졸업생의 학자금 대출 이자를 지원하여 경제적 부담을 덜어줍니다.',
    'https://www.kosaf.go.kr'
  );
INSERT INTO policies (id, title, category, age_min, age_max, income_limit, region, benefit_summary, description, apply_url) VALUES (
    '21',
    '청년 일자리 도약 장려금',
    'job',
    15,
    34,
    NULL,
    '전국',
    '청년 채용 기업에 최대 1,200만 원 지원 (청년에게 간접 혜택)',
    '취업 애로 청년을 정규직으로 채용한 중소기업에 인건비를 지원하여 청년 취업을 장려합니다.',
    'https://www.work.go.kr'
  );
INSERT INTO policies (id, title, category, age_min, age_max, income_limit, region, benefit_summary, description, apply_url) VALUES (
    '22',
    'K-Digital Training',
    'job',
    15,
    34,
    NULL,
    '전국',
    '디지털 신기술 훈련비 전액 지원 + 훈련수당 지급',
    'AI, 빅데이터 등 디지털 핵심 실무 인재 양성을 위한 훈련 과정을 무료로 제공합니다.',
    'https://www.hrd.go.kr'
  );
INSERT INTO policies (id, title, category, age_min, age_max, income_limit, region, benefit_summary, description, apply_url) VALUES (
    '23',
    '청년 도전 지원 사업',
    'job',
    18,
    34,
    NULL,
    '전국',
    '맞춤형 프로그램 이수 시 최대 300만 원 수당 지급',
    '구직 단념 청년에게 자신감 회복 및 취업 역량 강화 프로그램을 제공합니다.',
    'https://www.work.go.kr'
  );
INSERT INTO policies (id, title, category, age_min, age_max, income_limit, region, benefit_summary, description, apply_url) VALUES (
    '24',
    '해외 취업 정착 지원금',
    'job',
    34,
    34,
    NULL,
    '전국',
    '해외 취업 성공 시 최대 600만 원 지원',
    '청년들의 해외 진출을 장려하고 초기 현지 정착을 돕기 위해 지원금을 지급합니다.',
    'https://www.worldjob.or.kr'
  );
INSERT INTO policies (id, title, category, age_min, age_max, income_limit, region, benefit_summary, description, apply_url) VALUES (
    '25',
    '일자리 채움 청년 지원금',
    'job',
    15,
    34,
    NULL,
    '전국',
    '제조업 등 빈 일자리 업종 취업 시 최대 200만 원 지원',
    '인력난을 겪는 중소기업에 취업한 청년에게 격려금을 지원하여 장기 근속을 유도합니다.',
    'https://www.work.go.kr'
  );
INSERT INTO policies (id, title, category, age_min, age_max, income_limit, region, benefit_summary, description, apply_url) VALUES (
    '26',
    '청년 창업 사관학교',
    'job',
    39,
    39,
    NULL,
    '전국',
    '창업 자금 최대 1억 원 및 창업 교육, 코칭 지원',
    '우수한 창업 아이템을 보유한 청년 창업가를 발굴하여 창업의 전 과정을 지원합니다.',
    'https://start.kosmes.or.kr'
  );
INSERT INTO policies (id, title, category, age_min, age_max, income_limit, region, benefit_summary, description, apply_url) VALUES (
    '27',
    '국가장학금 (I, II 유형)',
    'education',
    19,
    29,
    NULL,
    '전국',
    '소득 구간에 따라 등록금 전액 또는 일부 지원',
    '대학생들의 등록금 부담을 완화하기 위해 소득 수준에 따라 장학금을 차등 지급합니다.',
    'https://www.kosaf.go.kr'
  );
INSERT INTO policies (id, title, category, age_min, age_max, income_limit, region, benefit_summary, description, apply_url) VALUES (
    '28',
    '국가근로장학금',
    'education',
    19,
    29,
    NULL,
    '전국',
    '교내외 근로 시 시급 9,860원~12,220원 장학금 지급',
    '저소득층 대학생에게 근로 기회를 제공하고 그 대가로 장학금을 지급합니다.',
    'https://www.kosaf.go.kr'
  );
INSERT INTO policies (id, title, category, age_min, age_max, income_limit, region, benefit_summary, description, apply_url) VALUES (
    '29',
    '희망사다리 장학금',
    'education',
    19,
    29,
    NULL,
    '전국',
    '중소/중견기업 취업 또는 창업 희망자에게 등록금 및 장려금 지원',
    '중소기업 취업 활성화 및 청년 창업 지원을 위한 장학금입니다.',
    'https://www.kosaf.go.kr'
  );
INSERT INTO policies (id, title, category, age_min, age_max, income_limit, region, benefit_summary, description, apply_url) VALUES (
    '30',
    '경기도 대학생 학자금 대출 이자 지원',
    'education',
    19,
    39,
    NULL,
    '경기도',
    '학자금 대출 이자 전액 지원',
    '경기도 거주 대학생, 대학원생, 졸업생의 학자금 대출 이자를 지원합니다.',
    'https://apply.jobaba.net'
  );
INSERT INTO policies (id, title, category, age_min, age_max, income_limit, region, benefit_summary, description, apply_url) VALUES (
    '31',
    '서울 런 (Seoul Learn)',
    'education',
    6,
    24,
    NULL,
    '서울',
    '유명 인강 무료 수강 및 멘토링 지원',
    '소득 계층 간 교육 격차 해소를 위해 저소득층 청소년 및 청년에게 교육 콘텐츠를 제공합니다.',
    'https://slearn.seoul.go.kr'
  );
INSERT INTO policies (id, title, category, age_min, age_max, income_limit, region, benefit_summary, description, apply_url) VALUES (
    '32',
    '청년 마음건강 지원사업',
    'welfare',
    19,
    34,
    NULL,
    '전국',
    '전문 심리상담 서비스 10회 이용권 제공 (본인부담금 10%)',
    '심리적 어려움을 겪는 청년들에게 전문적인 심리 상담 서비스를 지원합니다.',
    'https://www.bokjiro.go.kr'
  );
INSERT INTO policies (id, title, category, age_min, age_max, income_limit, region, benefit_summary, description, apply_url) VALUES (
    '33',
    '서울시 고립 은둔 청년 지원',
    'welfare',
    19,
    39,
    NULL,
    '서울',
    '심리 상담, 관계 형성 프로그램, 진로 탐색 등 맞춤형 지원',
    '사회와 단절된 고립 은둔 청년의 사회 복귀를 돕기 위한 통합 지원 프로그램입니다.',
    'https://youth.seoul.go.kr'
  );
INSERT INTO policies (id, title, category, age_min, age_max, income_limit, region, benefit_summary, description, apply_url) VALUES (
    '34',
    '자립준비청년 자립수당',
    'welfare',
    18,
    24,
    NULL,
    '전국',
    '매월 50만 원 자립 수당 지급 (최대 5년)',
    '아동양육시설 등에서 보호 종료된 청년의 안정적인 사회 정착을 위해 수당을 지급합니다.',
    'https://www.bokjiro.go.kr'
  );
INSERT INTO policies (id, title, category, age_min, age_max, income_limit, region, benefit_summary, description, apply_url) VALUES (
    '35',
    '청년 신체건강 증진 서비스',
    'welfare',
    19,
    34,
    NULL,
    '전국',
    '월 24만 원 운동비 지원 (본인부담금 10%)',
    '비만 또는 허약 체질 청년에게 맞춤형 운동 처방 및 건강 관리 서비스를 제공합니다.',
    'https://www.bokjiro.go.kr'
  );
INSERT INTO policies (id, title, category, age_min, age_max, income_limit, region, benefit_summary, description, apply_url) VALUES (
    '36',
    '경기도 청년 면접 수당',
    'cash',
    18,
    39,
    NULL,
    '경기도',
    '면접 1회당 5만 원, 최대 10회(50만 원) 지급',
    '경기도 거주 청년의 적극적인 구직 활동을 지원하기 위해 면접 비용을 지원합니다.',
    'https://thankyou.jobaba.net'
  );
INSERT INTO policies (id, title, category, age_min, age_max, income_limit, region, benefit_summary, description, apply_url) VALUES (
    '37',
    '청년 문화예술패스',
    'welfare',
    19,
    19,
    NULL,
    '전국',
    '연간 최대 15만 원 공연/전시 관람비 지원',
    '사회에 첫 발을 내딛는 19세 청년들에게 문화 예술 향유 기회를 제공합니다.',
    'https://www.culture.go.kr'
  );
INSERT INTO policies (id, title, category, age_min, age_max, income_limit, region, benefit_summary, description, apply_url) VALUES (
    '38',
    '산업단지 중소기업 청년 교통비 지원',
    'cash',
    15,
    34,
    NULL,
    '전국',
    '매월 5만 원 교통비 바우처 지급',
    '교통 여건이 열악한 산업단지 내 중소기업에 재직 중인 청년에게 교통비를 지원합니다.',
    'https://card.kicox.or.kr'
  );
INSERT INTO policies (id, title, category, age_min, age_max, income_limit, region, benefit_summary, description, apply_url) VALUES (
    '39',
    '청년 농업인 영농 정착 지원',
    'job',
    18,
    39,
    NULL,
    '전국',
    '월 최대 110만 원 영농 정착 지원금 지급 (최장 3년)',
    '젊고 유능한 인재의 농업 분야 진출을 촉진하기 위해 정착금을 지원합니다.',
    'https://uni.agrix.go.kr'
  );
INSERT INTO policies (id, title, category, age_min, age_max, income_limit, region, benefit_summary, description, apply_url) VALUES (
    '40',
    '청년 어선 임대 사업',
    'job',
    19,
    49,
    NULL,
    '전국',
    '어선 임대료 50% 지원 및 어업 멘토링',
    '어선 확보가 어려운 청년 어업인에게 유휴 어선을 임대해주어 어촌 정착을 돕습니다.',
    'https://www.fira.or.kr'
  );
INSERT INTO policies (id, title, category, age_min, age_max, income_limit, region, benefit_summary, description, apply_url) VALUES (
    '41',
    '군 장병 자기개발 비용 지원',
    'education',
    18,
    28,
    NULL,
    '전국',
    '연간 최대 12만 원 지원 (도서 구입, 강좌 수강 등)',
    '군 복무 중인 장병들의 자기 개발 욕구를 충족시키기 위해 비용을 지원합니다.',
    'https://www.mnd.go.kr'
  );
INSERT INTO policies (id, title, category, age_min, age_max, income_limit, region, benefit_summary, description, apply_url) VALUES (
    '42',
    '청년 기술 창업 교실',
    'job',
    19,
    39,
    NULL,
    '전국',
    '실전 창업 교육 및 멘토링 무료 제공',
    '기술 기반 창업을 희망하는 청년들에게 체계적인 창업 교육을 제공합니다.',
    'https://www.k-startup.go.kr'
  );
INSERT INTO policies (id, title, category, age_min, age_max, income_limit, region, benefit_summary, description, apply_url) VALUES (
    '43',
    '청년 사회적 주택',
    'housing',
    19,
    39,
    NULL,
    '서울',
    '시세 80% 이하 임대료로 셰어하우스 등 공급',
    '사회적 경제 주체가 운영하는 청년 맞춤형 공동체 주택입니다.',
    'https://soco.seoul.go.kr'
  );
INSERT INTO policies (id, title, category, age_min, age_max, income_limit, region, benefit_summary, description, apply_url) VALUES (
    '44',
    '청년 안심 주택',
    'housing',
    19,
    39,
    NULL,
    '서울',
    '역세권에 시세보다 저렴한 임대주택 공급 (공공/민간)',
    '대중교통이 편리한 곳에 청년들이 안심하고 살 수 있는 주택을 공급합니다.',
    'https://soco.seoul.go.kr'
  );
INSERT INTO policies (id, title, category, age_min, age_max, income_limit, region, benefit_summary, description, apply_url) VALUES (
    '45',
    '부산 청년 기쁨 두배 통장',
    'finance',
    18,
    34,
    NULL,
    '부산',
    '저축액만큼 시에서 매칭 지원 (최대 540만 원)',
    '부산 거주 일하는 청년의 자산 형성을 돕기 위한 통장입니다.',
    'https://boogi2.kr'
  );
INSERT INTO policies (id, title, category, age_min, age_max, income_limit, region, benefit_summary, description, apply_url) VALUES (
    '46',
    '대구 청년 희망 적금',
    'finance',
    19,
    34,
    NULL,
    '대구',
    '6개월 120만 원 저축 시 120만 원 지원',
    '대구 청년들의 단기 소액 자산 형성을 지원합니다.',
    'https://youth.daegu.go.kr'
  );
INSERT INTO policies (id, title, category, age_min, age_max, income_limit, region, benefit_summary, description, apply_url) VALUES (
    '47',
    '인천 드림 For 청년 통장',
    'finance',
    18,
    39,
    NULL,
    '인천',
    '3년 1,080만 원 저축 시 1,080만 원 지원',
    '인천 중소기업 재직 청년의 장기 근속과 자산 형성을 지원합니다.',
    'https://dream.incheon.kr'
  );
INSERT INTO policies (id, title, category, age_min, age_max, income_limit, region, benefit_summary, description, apply_url) VALUES (
    '48',
    '광주 청년 13(일삶) 통장',
    'finance',
    19,
    34,
    NULL,
    '광주',
    '월 10만 원 10개월 저축 시 100만 원 추가 지원',
    '광주 청년들의 더 나은 삶을 위한 자산 형성을 지원합니다.',
    'https://www.gwangju.go.kr'
  );
INSERT INTO policies (id, title, category, age_min, age_max, income_limit, region, benefit_summary, description, apply_url) VALUES (
    '49',
    '대전 청년 희망 통장',
    'finance',
    18,
    39,
    NULL,
    '대전',
    '월 15만 원 36개월 저축 시 1:1 매칭 지원',
    '대전 청년들의 미래 설계를 위한 자금을 지원합니다.',
    'https://www.daejeonyouth.co.kr'
  );
INSERT INTO policies (id, title, category, age_min, age_max, income_limit, region, benefit_summary, description, apply_url) VALUES (
    '50',
    '제주 청년 희망 키움 통장',
    'finance',
    15,
    39,
    NULL,
    '제주',
    '근로소득공제금 및 근로소득장려금 지원',
    '제주 지역 저소득 청년의 자립을 위한 자산 형성을 지원합니다.',
    'https://www.jeju.go.kr'
  );