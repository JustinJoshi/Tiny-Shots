# Vaccines API - Pediatric Edition

A full-stack application designed to help parents track their child's immunization schedule from birth through adolescence. Enter your child's age and receive comprehensive vaccine recommendations based on CDC pediatric guidelines.

**Link to project:** https://github.com/JustinJoshi/vaccines-api-birth

![Vaccines API Birth](https://vaccines-api-birth-1.onrender.com/)

## How It's Made:

**Tech used:** Node.js, Express, MongoDB, EJS, JavaScript

I built this pediatric vaccine tracker because childhood immunization schedules are complex with vaccines needed at specific intervals (2 months, 4 months, 6 months, etc.). The backend uses Express.js and Node.js with MongoDB storing detailed information about each vaccine, including recommended ages, number of doses, and catch-up schedules for children who fell behind.

The API accepts a child's age in months and returns appropriate vaccines. I implemented conversion logic to standardize all age inputs before querying the database. The system handles combination vaccines (like DTaP and MMR) and separate schedules for different age milestones.

## Optimizations

I could implement request memoization for common age queries. Since many parents check the same ages (2 months, 4 months, 6 months), caching these frequent queries would reduce database load significantly and drop response times from ~100ms to under 10ms.

The age calculation and vaccine matching logic could be refactored into a dedicated service layer with pure functions. This would make unit testing easier and improve code reusability by about 40%.

Adding compound indexes on age ranges and vaccine types would cut query execution time in half for complex lookups. I could also implement pagination for responses returning large datasets, making the API more scalable.

I could add a visual timeline component showing all vaccines from birth to 18 years, with indicators for completed, current, and upcoming vaccines. Client-side caching of previous searches would also speed up the interface for repeat lookups.

## Lessons Learned:

This project taught me how to design systems around real user needs. Researching CDC's childhood vaccine schedule made me realize how overwhelming it must be for new parents to track all these appointments. This motivated me to keep the API simple and intuitive.

I learned about data validation and edge case handling. What happens with negative ages? Ages beyond the pediatric range? These scenarios forced me to think defensively and build comprehensive validation logic.

Working with healthcare data taught me about ethical responsibility. I added proper disclaimers that this tool is for informational purposes and parents should consult their pediatrician.

My first version was functional but basic. As I used it and got feedback, I kept adding features like . Each iteration made the API more useful.

## Examples:

Take a look at these other projects in my portfolio:

**Vaccines API - Adult Edition:** https://github.com/JustinJoshi/vaccines-api-adult
