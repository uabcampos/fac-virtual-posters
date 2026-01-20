import { PrismaClient, SessionStatus, PosterStatus, CommentType } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Clearing database...')
    await prisma.posterView.deleteMany()
    await prisma.comment.deleteMany()
    await prisma.poster.deleteMany()
    await prisma.session.deleteMany()

    console.log('Creating live session...')
    const session = await prisma.session.create({
        data: {
            name: 'FAC Summer 2026 Virtual Poster Session',
            slug: 'live-session',
            status: SessionStatus.LIVE,
            startAt: new Date(),
            endAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
    })

    const realPosters = [
        {
            file: 'Allen Watts.pdf',
            thumbnail: 'allen-watts.jpg',
            scholar: 'Kristen Allen-Watts, Ph.D., MPH',
            title: 'THE DEVELOPMENT OF PEER MODELS FOR PEOPLE LIVING WITH HIV AND DIABETES IN THE SETTING OF CHRONIC PAIN',
            whyThisMatters: 'Integrating peer-supported behavioral interventions can bridge the gap in managing complex co-morbidities like HIV and Diabetes.',
            summaryProblem: 'PWH experience a high dual burden of diabetes and chronic pain, but current self-management models lack dual-specific focus.',
            summaryAudience: 'People living with HIV and diabetes who also manage chronic pain conditions.',
            summaryMethods: 'A mixed-method approach including formative evaluation and a peer-led CBT-based intervention trial.',
            summaryFindings: 'Identified a critical need for integrated symptom management and the potential for peer models to high self-efficacy.',
            summaryChange: 'A shift towards holistic, community-based support systems that address physical and metabolic health simultaneously.',
            welcomeMessage: 'Hi, I am Dr. Kristen Allen-Watts. Welcome to my poster session where we explore the power of peer models in chronic care!'
        },
        {
            file: 'Andrabi.pdf',
            thumbnail: 'andrabi.jpg',
            scholar: 'Mudasir (Roohi) Andrabi, Ph.D., RN',
            title: 'COMMUNITY-BASED STROKE SELF-MANAGEMENT PROGRAM (CSSP): A FEASIBILITY STUDY',
            whyThisMatters: 'Self-management programs in rural communities can significantly reduce the recurrence of stroke and improve cardiovascular outcomes.',
            summaryProblem: 'High blood pressure among stroke patients in rural Alabama leads to high recurrence rates as populations age.',
            summaryAudience: 'African American stroke survivors aged 55+ in rural Alabama counties (Sumter, Pickens, Hale).',
            summaryMethods: 'Feasibility study using intervention development, telephonic follow-ups, and text reminders to support self-efficacy.',
            summaryFindings: 'Intervention demonstrated potential to improve BP management competencies and reduce recurring stroke risk.',
            summaryChange: 'Implementing scalable, community-based self-management strategies for rural and underserved populations.',
            welcomeMessage: 'Hi, I am Dr. Mudasir Andrabi. I am excited to share how our community-based programs are helping stroke survivors in Alabama!'
        },
        {
            file: 'Caldwell.pdf',
            thumbnail: 'caldwell.jpg',
            scholar: 'Jennifer Caldwell, Ph.D., MPH',
            title: 'THE EFFECT OF PROVIDING GENETIC RISK INFORMATION ON LIFESTYLE BEHAVIORS IN AFRICAN AMERICANS',
            whyThisMatters: 'Understanding genetic risk for CVD can empower African Americans to adopt healthier lifestyle changes through culturally centered strategies.',
            summaryProblem: 'African Americans face higher CVD risk but often lack access to the benefits of personal genetic risk information for prevention.',
            summaryAudience: 'African American adults at risk for cardiovascular disease.',
            summaryMethods: 'A 16-week mixed-method randomized behavioral intervention assessing the impact of genetic risk knowledge.',
            summaryFindings: 'Genetic risk information can act as a motivator for lifestyle behavioral change when paired with professional support.',
            summaryChange: 'Developing more culturally centered community engagement strategies for genomic health.',
            welcomeMessage: 'Hello! I am Dr. Jennifer Caldwell. Let’s discuss how genetic information can be a tool for health equity in our communities.'
        },
        {
            file: 'Cardozo.pdf',
            thumbnail: 'cardozo.jpg',
            scholar: 'Licy L. Cardozo, M.D.',
            title: 'CARDIOMETABOLIC COMPLICATIONS IN WOMEN WITH PCOS: ROLE OF ANDROGENS AND RACE/ETHNICITY',
            whyThisMatters: 'Investigating the link between social determinants and biological markers is key to addressing racial disparities in PCOS-related diseases.',
            summaryProblem: 'Women with PCOS from minority backgrounds face increased incidence of cardiometabolic and cardiovascular risk factors.',
            summaryAudience: 'Researchers and practitioners focused on women\'s health and ethnic disparities in metabolic disorders.',
            summaryMethods: 'Testing the role of social determinants (SDOH) in modulating androgen levels and renin-angiotensin system components.',
            summaryFindings: 'SDOH factors such as food insecurity and healthcare access play a significant role in racial disparities in PCOS outcomes.',
            summaryChange: 'Integrating SDOH screening and mitigation into clinical care for women with PCOS to eliminate health gaps.',
            welcomeMessage: 'Hi, I’m Dr. Licy Cardozo. Welcome to my session on the intersection of social factors and metabolic health in women.'
        },
        {
            file: 'Clarkson.pdf',
            thumbnail: 'clarkson.jpg',
            scholar: 'Stephen Clarkson, M.D., MSPH',
            title: 'SOCIAL DETERMINANTS OF HEALTH AND THEIR IMPACT ON ESTABLISHING HEART FAILURE CARE',
            whyThisMatters: 'Identifying community-level barriers allows clinics to build stronger, more reliable pathways for long-term heart failure management.',
            summaryProblem: 'Uninsured or underinsured adults with heart failure face significant barriers to attending follow-up care in underserved clinics.',
            summaryAudience: 'Patients and providers within the HRTSA clinic system and regional healthcare leaders.',
            summaryMethods: 'Prevalence study of SDOH among heart failure patients and qualitative interviews to identify specific linkage barriers.',
            summaryFindings: 'Patients with higher SES vulnerability are significantly less likely to engage in consistent clinical follow-ups.',
            summaryChange: 'Improving patient confidence and logistics (like transportation) to ensure regular attendance and better heart outcomes.',
            welcomeMessage: 'Hi, I’m Dr. Stephen Clarkson. I’m looking forward to discussing how we can bridge social gaps to save more hearts.'
        },
        {
            file: 'Crockett.pdf',
            thumbnail: 'crockett.jpg',
            scholar: 'Kaylee B. Crockett, Ph.D.',
            title: 'ADAPTATION AND INITIAL FEASIBILITY OF A PRIMARY CARE-BASED DYADIC CARDIOVASCULAR RISK REDUCTION INTERVENTION',
            whyThisMatters: 'Treating social relationships as agents of change can unlock new levels of autonomy and success in preventing heart disease.',
            summaryProblem: 'Primary care providers often lack the time or dyadic tools to effectively address hypertension through behavioral modification.',
            summaryAudience: 'Patients with hypertension and their chosen support partners (dyads) in primary care settings.',
            summaryMethods: 'Mixed-method design to evaluate the "Heart Care Pairs" protocol, focusing on autonomy and interpersonal communication.',
            summaryFindings: 'The dyadic approach is feasible and highly acceptable to both patients and their partners in a primary care context.',
            summaryChange: 'A new model of "Heart Care Pairs" that leverages social support to lower cardiovascular risk.',
            welcomeMessage: 'Hello, I’m Dr. Kaylee Crockett. Welcome to my poster on the power of partnerships in heart health!'
        },
        {
            file: 'Gazaway.pdf',
            thumbnail: 'gazaway.jpg',
            scholar: 'Shena Gazaway, Ph.D., RN',
            title: 'A FEASIBILITY TRIAL OF A LAY-NAVIGATOR-DELIVERED INTERVENTION FOR CHRONIC KIDNEY DISEASE DYADS',
            whyThisMatters: 'Empowering Black CKD patients with lay coaches helps bridge the gap between clinical advice and real-world activation.',
            summaryProblem: 'Black patients face higher rates of CKD and often have insufficient support to stay active in their clinical decision-making.',
            summaryAudience: 'Black individuals with Stage 3 or 4 Kidney Disease and their care partners.',
            summaryMethods: 'A feasibility trial of the "ImPart-Multi" intervention delivered by lay coach navigators via telehealth.',
            summaryFindings: 'Preliminary results show strong engagement and high acceptability of lay navigation among kidney disease dyads.',
            summaryChange: 'Establishing sustainable lay-navigation services to improve health literacy and behavior engagement in CKD.',
            welcomeMessage: 'Hi, I am Dr. Shena Gazaway. Join me to discuss how lay navigators are making a difference in kidney care!'
        },
        {
            file: 'Gerke.pdf',
            thumbnail: 'gerke.jpg',
            scholar: 'Donald (Donny) Gerke, Ph.D., MSW',
            title: 'FACILITATED STABLE HOUSING AS A STRATEGY FOR HIV AND CARDIOMETABOLIC MEDICINE SUSTAINMENT',
            whyThisMatters: 'Housing is healthcare. Stable living conditions are a prerequisite for long-term survival and health management for PWH.',
            summaryProblem: 'Unstable housing is a major driver of poor HIV and cardiometabolic outcomes, but the exact mechanisms are under-studied.',
            summaryAudience: 'People living with HIV (PWH) and social work professionals.',
            summaryMethods: 'Sequential explanatory design involving AIDS Alabama and UAB 1917 Clinic to track medicine uptake.',
            summaryFindings: 'Identified a strong link between facilitated stable housing and consistent engagement in cardiometabolic care.',
            summaryChange: 'Advocating for integrated housing-first strategies as a core component of HIV medical care.',
            welcomeMessage: 'Hi, I’m Dr. Donny Gerke. Let’s talk about why stable housing is one of our most powerful medicines.'
        },
        {
            file: 'Ghazi.pdf',
            thumbnail: 'ghazi.jpg',
            scholar: 'Lama Ghazi, M.D., Ph.D.',
            title: 'POST-EMERGENCY DEPARTMENT DISCHARGE CLINIC TELEHEALTH PROGRAM FOR UNCONTROLLED HYPERTENSION',
            whyThisMatters: 'Telehealth bridge clinics can catch high-risk patients before they fall through the cracks after an ER visit.',
            summaryProblem: 'Hypertension is often poorly managed after hospital discharge, leading to high return rates to the emergency room.',
            summaryAudience: 'Patients with uncontrolled hypertension discharged from the Emergency Department.',
            summaryMethods: 'Feasibility trial of a pharmacist-led telehealth intervention for blood pressure monitoring and titration.',
            summaryFindings: 'The program successfully reduced BP levels and was highly acceptable to a diverse patient population.',
            summaryChange: 'Implementing post-discharge "bridge" telehealth to prevent hypertension-related emergencies.',
            welcomeMessage: 'Hello! I am Dr. Lama Ghazi. My research focuses on using technology to keep heart health stable after the ER.'
        },
        {
            file: 'Gravett.pdf',
            thumbnail: 'gravett.jpg',
            scholar: 'Ronnie M. Gravett, M.D., MSPH',
            title: 'LAYING THE FOUNDATION FOR HIV PRE-EXPOSURE PROPHYLAXIS (PrEP) IN SOUTHERN URGENT CARE CLINICS',
            whyThisMatters: 'Urgent care clinics are an untapped frontier for HIV prevention, especially for communities facing the highest risk.',
            summaryProblem: 'PrEP is severely underutilized in Southern communities due to inadequate access and lack of provider awareness in urgent care.',
            summaryAudience: 'Clinical staff and patients in Southern urgent care settings.',
            summaryMethods: 'Community advisory group consultations followed by a mixed-methods approach to identify implementation determinants.',
            summaryFindings: 'Urgent care patients and staff feel that providing PrEP in these settings is both feasible and highly acceptable.',
            summaryChange: 'Building a new framework for PrEP delivery in urgent care to reduce HIV disparities across the South.',
            welcomeMessage: 'Hi, I’m Dr. Ronnie Gravett. Join me to discuss expanding the front lines of HIV prevention in the South!'
        },
        {
            file: 'Karlson.pdf',
            thumbnail: 'karlson.jpg',
            scholar: 'Cynthia Karlson, Ph.D.',
            title: 'SICKLE CELL FIT: INCREASING PHYSICAL ACTIVITY IN YOUTH WITH SICKLE CELL DISEASE',
            whyThisMatters: 'Tailored exercise programs can break the cycle of pain and inactivity for young people living with Sickle Cell.',
            summaryProblem: 'Youth with Sickle Cell Disease (SCD) have high rates of cardiometabolic disease but often fear and avoid physical activity.',
            summaryAudience: 'Youth with SCD (aged 12-21) and their caregivers.',
            summaryMethods: 'Feasibility test of the "Warrior FIT" intervention using telehealth-delivered moderate-intensity exercise sessions.',
            summaryFindings: 'Participants achieved >60% completion rates with minimal adverse events, showing exercise is safe and achievable.',
            summaryChange: 'Scaling telehealth-based "Warrior FIT" programs to improve physical fitness and quality of life for SCD youth.',
            welcomeMessage: 'Hi, I’m Dr. Cynthia Karlson. I’m passionate about helping youth with Sickle Cell find their "fit" and stay active!'
        },
        {
            file: 'Khodneva.pdf',
            thumbnail: 'khodneva.jpg',
            scholar: 'Yulia Khodneva, M.D., Ph.D.',
            title: 'PATIENT AWARENESS AND UNDERSTANDING OF HEART FAILURE WITH PRESERVED EJECTION FRACTION (HFPEF)',
            whyThisMatters: 'Closing the knowledge gap for patients is the first step in ensuring they can actively manage complex heart conditions.',
            summaryProblem: 'HFpEF is the fastest growing heart condition globally, but many patients remain completely unaware of their diagnosis.',
            summaryAudience: 'Adult patients with Stage C HFpEF, particularly from underserved populations.',
            summaryMethods: 'Qualitative study using semi-structured interviews to describe patient understanding and learning needs.',
            summaryFindings: 'Identified significant gaps in awareness; patients often confuse their condition or lack monitoring skills.',
            summaryChange: 'Developing informational and mental health support interventions timed at the moment of initial diagnosis.',
            welcomeMessage: 'Hello, I’m Dr. Yulia Khodneva. Let’s talk about empowering patients through better understanding of HFpEF.'
        },
        {
            file: 'Kinsey.pdf',
            thumbnail: 'kinsey.jpg',
            scholar: 'Amber W. Kinsey, Ph.D.',
            title: 'INTEGRATED CARDIOMETABOLIC INTERVENTION TARGETING PHYSICAL AND FINANCIAL HEALTH',
            whyThisMatters: 'Addressing financial stress alongside physical health is essential for sustainable metabolic improvement in low-income communities.',
            summaryProblem: 'Black adults in the South face high rates of obesity and diabetes, often driven by a lack of both physical and financial resources.',
            summaryAudience: 'Black adults with cardiometabolic conditions and low-to-moderate household income.',
            summaryMethods: 'Pilot study evaluating a 12-week intervention that integrates resistance exercise with financial capability training.',
            summaryFindings: 'The integrated approach is scalable and successfully addresses the overlapping drivers of health disparities.',
            summaryChange: 'A shift towards holistic health programs that treat biological and economic risks as a single ecosystem.',
            welcomeMessage: 'Hi, I’m Dr. Amber Kinsey. Join me to explore how we can heal both bodies and bank accounts together!'
        },
        {
            file: 'Lai.pdf',
            thumbnail: 'lai.jpg',
            scholar: 'Byron Lai, Ph.D.',
            title: 'VIRTUAL REALITY EXERCISE FOR IMPROVING HEALTH AMONG CHILDREN WITH DISABILITIES: FEASIBILITY STUDY',
            whyThisMatters: 'VR technology makes exercise fun and accessible for children who might otherwise be excluded from traditional physical activity.',
            summaryProblem: 'Children with mobility disabilities have limited exercise options and are 3x more likely to develop metabolic diseases.',
            summaryAudience: 'High school students with mobility disabilities and physical education staff.',
            summaryMethods: 'Feasibility test of a 6-week virtual reality exercise program using Meta Quest 3 headsets at home and school.',
            summaryFindings: 'VR exergaming is safe, effective, and significantly increases moderate exercise minutes compared to traditional routines.',
            summaryChange: 'Integrating VR technology into school-based exercise programs to ensure fitness equity for all children.',
            welcomeMessage: 'Hi! I’m Dr. Byron Lai. Let’s step into the future of fitness for children with disabilities!'
        },
        {
            file: 'Myers.pdf',
            thumbnail: 'myers.jpg',
            scholar: 'Candice A. Myers, Ph.D.',
            title: 'TARGETING HEALTHY WEIGHT LOSS IN THE CONTEXT OF FOOD INSECURITY: PILOT AND FEASIBILITY TRIAL II',
            whyThisMatters: 'When food is uncertain, weight loss requires a specialized psychological and resource-aware approach.',
            summaryProblem: 'Food insecurity moderates weight loss in adults with obesity, making traditional interventions less effective.',
            summaryAudience: 'Food-insecure women aged 18-65 with obesity.',
            summaryMethods: '12-week non-randomized trial evaluating a tailored weight loss intervention that accounts for resource insecurity.',
            summaryFindings: 'Tailored behavioral strategies can still achieve weight loss even when participants are experiencing food instability.',
            summaryChange: 'Refining public health interventions to mitigate health disparities in food-insecure rural populations.',
            welcomeMessage: 'Hello, I am Dr. Candice Myers. Welcome to my session on navigating weight health in the face of food insecurity.'
        },
        {
            file: 'Worthington.pdf',
            thumbnail: 'worthington.jpg',
            scholar: 'Camille Worthington, Ph.D., RDN, LDN',
            title: '"HEARTY MEALS FOR MOMS": HOME-DELIVERED MEALS TO MANAGE CARDIOMETABOLIC HEALTH DURING PREGNANCY',
            whyThisMatters: 'Removing the barrier of cooking and shopping allows pregnant moms to prioritize their metabolic health during a critical window.',
            summaryProblem: 'Low-income pregnant women in the Deep South face high risks of adverse outcomes due to poor diet and food insecurity.',
            summaryAudience: 'Medicaid-eligible pregnant women (18-20 weeks) with overweight or obesity.',
            summaryMethods: 'Feasibility study providing 10 home-delivered meals per week alongside nutritional counseling.',
            summaryFindings: 'Meal delivery is highly feasible and significantly improves diet quality during the second and third trimesters.',
            summaryChange: 'Establishing meal delivery as a reimbursable health service to reduce disparities in maternal-child health.',
            welcomeMessage: 'Hi, I’m Dr. Camille Worthington. Let’s discuss how hearty meals can create healthier futures for moms and babies!'
        },
        {
            file: 'Xie1.pdf',
            thumbnail: 'xie-1.jpg',
            scholar: 'Rongbing Xie, DrPH, MPH',
            title: 'ENHANCING RECRUITMENT AND RETENTION FOR BLACK FEMALES WITH HIV: IDENTIFYING BARRIERS',
            whyThisMatters: 'Recruiting from underserved populations requires building deep trust and addressing specific social determinants of participation.',
            summaryProblem: 'Black females with HIV are disproportionately at risk for cardiometabolic issues but are under-represented in clinical trials.',
            summaryAudience: 'Black females living with HIV and clinical research coordinators.',
            summaryMethods: 'Focus groups and qualitative analysis to identify facilitators (like trust) and barriers (like stigma) to research participation.',
            summaryFindings: 'Cultural communication methods and community leaders are the most effective drivers of recruitment success.',
            summaryChange: 'A new framework for community-engaged recruitment that prioritizes trust and mitigates social barriers.',
            welcomeMessage: 'Hi, I’m Dr. Rongbing Xie. Join me to discuss how we can make research more inclusive and impactful for everyone.'
        },
        {
            file: 'Xie2.pdf',
            thumbnail: 'xie-2.jpg',
            scholar: 'Rongbing Xie, DrPH, MPH',
            title: 'DEVELOPING STRATEGIES TO IMPROVE DIET AND EXERCISE IN PEOPLE LIVING WITH HIV (PLHIV)',
            whyThisMatters: 'Hyper-personalized strategies that account for social vulnerability are the key to long-term health adherence.',
            summaryProblem: 'Social vulnerability in PWH leads to poor hypertension control and lower diet quality, requiring multi-level interventions.',
            summaryAudience: 'Black and White adults living with HIV in the PROSPER-HIV study cohort.',
            summaryMethods: 'Multi-level regression to examine the interplay between social determinants, diet, and cardiovascular outcomes.',
            summaryFindings: 'Identified that social vulnerability metrics are stronger predictors of health outcomes than biological factors alone.',
            summaryChange: 'A shift towards tailoring exercise and diet programs to specific social vulnerability profiles.',
            welcomeMessage: 'Hello again! I am Dr. Rongbing Xie. Let’s dive into the data on how our social environment shapes our health habits.'
        }
    ]

    console.log(`Seeding ${realPosters.length} AI-processed posters...`)

    for (const [index, p] of realPosters.entries()) {
        const slug = p.file.toLowerCase().replace(/\s+/g, '-').replace('.pdf', '')

        await prisma.poster.create({
            data: {
                title: p.title,
                scholarNames: [p.scholar],
                institutions: ['Forge AHEAD Center'],
                tags: ['Research', 'Innovation', '2026'],
                whyThisMatters: p.whyThisMatters,
                summaryProblem: p.summaryProblem,
                summaryAudience: p.summaryAudience,
                summaryMethods: p.summaryMethods,
                summaryFindings: p.summaryFindings,
                summaryChange: p.summaryChange,
                welcomeMessage: p.welcomeMessage,
                feedbackPrompt: 'I am particularly interested in your thoughts on clinical implementation and community impact.',
                sessionId: session.id,
                slug,
                status: PosterStatus.PUBLISHED,
                publishedAt: new Date(),
                posterPdfUrl: `/uploads/${p.file}`,
                posterImageUrl: `/uploads/thumbnails/${p.thumbnail}`,
                posterImageWidth: 1200,
                posterImageHeight: 1800,
            },
        })
    }

    console.log('Final AI Seed completed successfully!')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
