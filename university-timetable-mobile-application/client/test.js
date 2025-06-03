const timeMap = {
  1: "9:00 AM",
  2: "10:00 AM",
  3: "11:00 AM",
  4: "12:00 PM",
  5: "1:00 PM",
  6: "2:00 PM",
  7: "3:00 PM",
  8: "4:00 PM"
};

// Function to get today's timetable

function getTodaysFormattedTimetable(data) {
  const weekdays = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday"
  ];
  const todayName = weekdays[new Date().getDay()];

  const todaySchedule = data.schedule.find(
    (dayEntry) => dayEntry.day.toLowerCase() === todayName
  );

  if (!todaySchedule) return [];

  const formatted = todaySchedule.time_slots
    .filter((slot) => !slot.is_empty)
    .map((slot, index) => ({
      id: String(index + 1),
      course: slot.course_name,
      time: timeMap[slot.slot_number] || "TBD",
      room: `Room-${slot.course_code || "N/A"}`,
      teacher: slot.faculty
    }));

  console.log(formatted)
  return formatted;
}

data = {
  "_id": {
    "$oid": "6834cc23f945cac8ef176984"
  },
  "semester": "III",
  "section": "A",
  "schedule": [
    {
      "day": "monday",
      "time_slots": [
        {
          "slot_number": 1,
          "is_empty": false,
          "course_name": "Analog and Digital Electronics",
          "duration_or_credits": 6,
          "faculty": "Dr. Rajesh Eswarawaka",
          "designation": "Professor",
          "course_code": "ADE"
        },
        {
          "slot_number": 2,
          "is_empty": false,
          "course_name": "Data Structures and its Applications",
          "duration_or_credits": 6,
          "faculty": "Dr. Ramesh Babu H S",
          "designation": "Principal",
          "course_code": "DSA"
        },
        {
          "slot_number": 3,
          "is_empty": false,
          "course_name": "Transform Calculus, Fourier Series and Numerical Techniques",
          "duration_or_credits": 5,
          "faculty": "Mrs. Math Faculty",
          "designation": "Associate Professor",
          "course_code": "Maths"
        },
        {
          "slot_number": 4,
          "is_empty": false,
          "course_name": "Computer Organization and Architecture",
          "duration_or_credits": 5,
          "faculty": "Dr. Mallikarjun H M",
          "designation": "Assistant Professor",
          "course_code": "COA"
        },
        {
          "slot_number": 5,
          "is_empty": true,
          "course_name": null,
          "duration_or_credits": null,
          "faculty": null,
          "designation": null,
          "course_code": null
        },
        {
          "slot_number": 6,
          "is_empty": false,
          "course_name": "Object Oriented Programming with JAVA Laboratory",
          "duration_or_credits": 3,
          "faculty": "Dr. Pavithra G S",
          "designation": "Associate Professor",
          "course_code": "OOPS java"
        },
        {
          "slot_number": 7,
          "is_empty": true,
          "course_name": null,
          "duration_or_credits": null,
          "faculty": null,
          "designation": null,
          "course_code": null
        },
        {
          "slot_number": 8,
          "is_empty": true,
          "course_name": null,
          "duration_or_credits": null,
          "faculty": null,
          "designation": null,
          "course_code": null
        }
      ]
    },
    {
      "day": "tuesday",
      "time_slots": [
        {
          "slot_number": 1,
          "is_empty": false,
          "course_name": "Transform Calculus, Fourier Series and Numerical Techniques",
          "duration_or_credits": 5,
          "faculty": "Mrs. Math Faculty",
          "designation": "Associate Professor",
          "course_code": "Maths"
        },
        {
          "slot_number": 2,
          "is_empty": false,
          "course_name": "Data Structures and its Applications",
          "duration_or_credits": 6,
          "faculty": "Dr. Ramesh Babu H S",
          "designation": "Principal",
          "course_code": "DSA"
        },
        {
          "slot_number": 3,
          "is_empty": false,
          "course_name": "Analog and Digital Electronics",
          "duration_or_credits": 6,
          "faculty": "Dr. Rajesh Eswarawaka",
          "designation": "Professor",
          "course_code": "ADE"
        },
        {
          "slot_number": 4,
          "is_empty": false,
          "course_name": "Social Connect and Responsibility",
          "duration_or_credits": 3,
          "faculty": "Dr. Usha M",
          "designation": "Assistant Professor",
          "course_code": "SCR"
        },
        {
          "slot_number": 5,
          "is_empty": true,
          "course_name": null,
          "duration_or_credits": null,
          "faculty": null,
          "designation": null,
          "course_code": null
        },
        {
          "slot_number": 6,
          "is_empty": false,
          "course_name": "Samskrutika Kannada",
          "duration_or_credits": 3,
          "faculty": "Ms. Ashwini K",
          "designation": "Assistant Professor",
          "course_code": "BK"
        },
        {
          "slot_number": 7,
          "is_empty": false,
          "course_name": "Programming in C++",
          "duration_or_credits": 3,
          "faculty": "Ms. Manisha Mehta",
          "designation": "Assistant Professor",
          "course_code": "CPP"
        },
        {
          "slot_number": 8,
          "is_empty": false,
          "course_name": "Computer Organization and Architecture",
          "duration_or_credits": 5,
          "faculty": "Dr. Mallikarjun H M",
          "designation": "Assistant Professor",
          "course_code": "COA"
        }
      ]
    },
    {
      "day": "wednesday",
      "time_slots": [
        {
          "slot_number": 1,
          "is_empty": false,
          "course_name": "Object Oriented Programming with JAVA Laboratory",
          "duration_or_credits": 3,
          "faculty": "Dr. Pavithra G S",
          "designation": "Associate Professor",
          "course_code": "OOPS java"
        },
        {
          "slot_number": 2,
          "is_empty": false,
          "course_name": "Computer Organization and Architecture",
          "duration_or_credits": 5,
          "faculty": "Dr. Mallikarjun H M",
          "designation": "Assistant Professor",
          "course_code": "COA"
        },
        {
          "slot_number": 3,
          "is_empty": false,
          "course_name": "Analog and Digital Electronics",
          "duration_or_credits": 6,
          "faculty": "Dr. Rajesh Eswarawaka",
          "designation": "Professor",
          "course_code": "ADE"
        },
        {
          "slot_number": 4,
          "is_empty": false,
          "course_name": "Social Connect and Responsibility",
          "duration_or_credits": 3,
          "faculty": "Dr. Usha M",
          "designation": "Assistant Professor",
          "course_code": "SCR"
        },
        {
          "slot_number": 5,
          "is_empty": true,
          "course_name": null,
          "duration_or_credits": null,
          "faculty": null,
          "designation": null,
          "course_code": null
        },
        {
          "slot_number": 6,
          "is_empty": false,
          "course_name": "Samskrutika Kannada",
          "duration_or_credits": 3,
          "faculty": "Ms. Ashwini K",
          "designation": "Assistant Professor",
          "course_code": "BK"
        },
        {
          "slot_number": 7,
          "is_empty": false,
          "course_name": "Data Structures and its Applications",
          "duration_or_credits": 6,
          "faculty": "Dr. Ramesh Babu H S",
          "designation": "Principal",
          "course_code": "DSA"
        },
        {
          "slot_number": 8,
          "is_empty": true,
          "course_name": null,
          "duration_or_credits": null,
          "faculty": null,
          "designation": null,
          "course_code": null
        }
      ]
    },
    {
      "day": "thursday",
      "time_slots": [
        {
          "slot_number": 1,
          "is_empty": false,
          "course_name": "Data Structures and its Applications",
          "duration_or_credits": 6,
          "faculty": "Dr. Ramesh Babu H S",
          "designation": "Principal",
          "course_code": "DSA"
        },
        {
          "slot_number": 2,
          "is_empty": false,
          "course_name": "Programming in C++",
          "duration_or_credits": 3,
          "faculty": "Ms. Manisha Mehta",
          "designation": "Assistant Professor",
          "course_code": "CPP"
        },
        {
          "slot_number": 3,
          "is_empty": false,
          "course_name": "Transform Calculus, Fourier Series and Numerical Techniques",
          "duration_or_credits": 5,
          "faculty": "Mrs. Math Faculty",
          "designation": "Associate Professor",
          "course_code": "Maths"
        },
        {
          "slot_number": 4,
          "is_empty": false,
          "course_name": "Analog and Digital Electronics",
          "duration_or_credits": 6,
          "faculty": "Dr. Rajesh Eswarawaka",
          "designation": "Professor",
          "course_code": "ADE"
        },
        {
          "slot_number": 5,
          "is_empty": true,
          "course_name": null,
          "duration_or_credits": null,
          "faculty": null,
          "designation": null,
          "course_code": null
        },
        {
          "slot_number": 6,
          "is_empty": false,
          "course_name": "Computer Organization and Architecture",
          "duration_or_credits": 5,
          "faculty": "Dr. Mallikarjun H M",
          "designation": "Assistant Professor",
          "course_code": "COA"
        },
        {
          "slot_number": 7,
          "is_empty": true,
          "course_name": null,
          "duration_or_credits": null,
          "faculty": null,
          "designation": null,
          "course_code": null
        },
        {
          "slot_number": 8,
          "is_empty": true,
          "course_name": null,
          "duration_or_credits": null,
          "faculty": null,
          "designation": null,
          "course_code": null
        }
      ]
    },
    {
      "day": "friday",
      "time_slots": [
        {
          "slot_number": 1,
          "is_empty": false,
          "course_name": "Transform Calculus, Fourier Series and Numerical Techniques",
          "duration_or_credits": 5,
          "faculty": "Mrs. Math Faculty",
          "designation": "Associate Professor",
          "course_code": "Maths"
        },
        {
          "slot_number": 2,
          "is_empty": false,
          "course_name": "Social Connect and Responsibility",
          "duration_or_credits": 3,
          "faculty": "Dr. Usha M",
          "designation": "Assistant Professor",
          "course_code": "SCR"
        },
        {
          "slot_number": 3,
          "is_empty": false,
          "course_name": "Object Oriented Programming with JAVA Laboratory",
          "duration_or_credits": 3,
          "faculty": "Dr. Pavithra G S",
          "designation": "Associate Professor",
          "course_code": "OOPS java"
        },
        {
          "slot_number": 4,
          "is_empty": false,
          "course_name": "Programming in C++",
          "duration_or_credits": 3,
          "faculty": "Ms. Manisha Mehta",
          "designation": "Assistant Professor",
          "course_code": "CPP"
        },
        {
          "slot_number": 5,
          "is_empty": true,
          "course_name": null,
          "duration_or_credits": null,
          "faculty": null,
          "designation": null,
          "course_code": null
        },
        {
          "slot_number": 6,
          "is_empty": false,
          "course_name": "Samskrutika Kannada",
          "duration_or_credits": 3,
          "faculty": "Ms. Ashwini K",
          "designation": "Assistant Professor",
          "course_code": "BK"
        },
        {
          "slot_number": 7,
          "is_empty": false,
          "course_name": "Data Structures and its Applications",
          "duration_or_credits": 6,
          "faculty": "Dr. Ramesh Babu H S",
          "designation": "Principal",
          "course_code": "DSA"
        },
        {
          "slot_number": 8,
          "is_empty": false,
          "course_name": "Analog and Digital Electronics",
          "duration_or_credits": 6,
          "faculty": "Dr. Rajesh Eswarawaka",
          "designation": "Professor",
          "course_code": "ADE"
        }
      ]
    },
    {
      "day": "saturday",
      "time_slots": [
        {
          "slot_number": 1,
          "is_empty": false,
          "course_name": "Transform Calculus, Fourier Series and Numerical Techniques",
          "duration_or_credits": 5,
          "faculty": "Mrs. Math Faculty",
          "designation": "Associate Professor",
          "course_code": "Maths"
        },
        {
          "slot_number": 2,
          "is_empty": false,
          "course_name": "Analog and Digital Electronics",
          "duration_or_credits": 6,
          "faculty": "Dr. Rajesh Eswarawaka",
          "designation": "Professor",
          "course_code": "ADE"
        },
        {
          "slot_number": 3,
          "is_empty": false,
          "course_name": "Data Structures and its Applications",
          "duration_or_credits": 6,
          "faculty": "Dr. Ramesh Babu H S",
          "designation": "Principal",
          "course_code": "DSA"
        },
        {
          "slot_number": 4,
          "is_empty": false,
          "course_name": "Computer Organization and Architecture",
          "duration_or_credits": 5,
          "faculty": "Dr. Mallikarjun H M",
          "designation": "Assistant Professor",
          "course_code": "COA"
        }
      ]
    }
  ]
}

getTodaysFormattedTimetable(data)