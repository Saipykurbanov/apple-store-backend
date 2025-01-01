import pool from "../db";

const Views = {}

Views.getAllVisits = async () => {
    try {

        let req = await pool.query(`SELECT * FROM visits`)

        return {success: true, status: 200, data: req.rows}

    } catch(e) {
        return {success: false, message: e.message, status: 500}
    }
}

Views.getToday = async () => {
    try {
        const date = new Date();
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        const weekdays = ["ВС", "ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ"];
        let all = 0

        let req = await pool.query(`SELECT * FROM visits`)
        req = req.rows

        if(req.length > 0) {

            const firstDayOfWeek = new Date(date);
            const currentDay = date.getDay();
            const offset = currentDay === 0 ? 6 : currentDay - 1
            firstDayOfWeek.setDate(day - offset);

            const daysOfWeek = Array.from({ length: 7 }, (_, i) => {
                const dayN = new Date(firstDayOfWeek);
                dayN.setDate(firstDayOfWeek.getDate() + i)
                return {
                    day: dayN.getDate(),
                    month: dayN.getMonth() + 1,
                    year: dayN.getFullYear(),
                    count: [],
                    weekday: weekdays[dayN.getDay()]
                };
            });

            const result = daysOfWeek.map(dayOfWeek => {
                const existingVisit = req.find(visit =>
                    visit.day === dayOfWeek.day &&
                    visit.month === dayOfWeek.month &&
                    visit.year === dayOfWeek.year
                );
                return existingVisit ? { ...existingVisit, weekday: dayOfWeek.weekday } : dayOfWeek;
            });

            all = req.reduce((sum, el) => sum + el.count.length, 0);

            let today = req.find(item => item.day === day && item.month === month && item.year === year)?.count.length || 0

            return {success: true, status: 200, data: {today: today, all: all, list: result}}
        }

        return {success: true, status: 200, data: {today: 0, all: 0, list: []}}

    } catch(e) {
        return {success: false, message: e.message, status: 500}
    }
}

Views.addVisits = async (ip) => {
    try {
        const date = new Date();
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();

        let req = await pool.query(`
            SELECT * FROM visits WHERE day = $1 AND month = $2 AND year = $3`, 
            [day, month, year])
        let visit = req.rows[0]

        if(visit) {
            let list = visit.count
            if(list.includes(ip)) {
                return {success: true, status: 200, message: 'Пользователь вошёл на сайт, но уже добавлен в посетители'}
            } else {
                list.push(ip)
                await pool.query(`UPDATE visits SET count = $1 WHERE visitid = $2`, [list, visit.visitid])
            }
        } else {
            await pool.query(`INSERT INTO visits (day, month, year, count) VALUES ($1, $2, $3, $4)`, [day, month, year, [ip]])
        }

        return {success: true, status: 200}

    } catch(e) {
        return {success: false, message: e.message, status: 500}
    }
}

export default Views;