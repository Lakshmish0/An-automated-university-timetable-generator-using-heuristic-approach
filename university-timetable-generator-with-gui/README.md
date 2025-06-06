# 🆃🅸🅼🅴🆃🅰🅱🅻🅴 🅶🅴🅽🅴🆁🅰🆃🅾🆁                                                                        

 ### [RNS Institute of Technology, Bengaluru](https://www.rnsit.ac.in/)

_Timetable_ for a given section of a semester must contain details about the subjects taught hourly during the days of a week and the faculty members assigned to each subject. Timetables must be such that no two subjects taught by a single lecturer overlap. The problem of timetable scheduling is described as a *highly-constrained NP-hard problem*. It is known as the timetabling problem by most researchers. A lot of complex constraints need to be addressed for development of an efficient algorithm to solve this problem. Presently, in many institutions, the faculty in-charge has to manually assign hourly slots to every subject while satisfying various constraints. If an overlap/clash is found among the timetables, changes must be made manually using trial and error methods. This tends to take a considerable amount of time. With the help of software, this process can be simplified, thus reducing time spent. Various algorithms have been developed which provide techniques to generate timetables. This also simplifies error correction and future modification of timetables, aiding maintenance and usability.

__Timetable Generator__ is a desktop application that provides a simple and quick way to generate a timetable for a university. The software is developed using Python 3 for the backend and QT for the GUI. An algorithm based on the heuristic approach described in __ was developed to satisfy the educational model setup at __RNSIT__. Universities/colleges that come under **_Visvesvaraya Technological University(VTU)_** may also be able to use this with certain modifications and adjustments. This software was developed as major project during the final year of engineering. It was developed under the guidance of **_Ms. Vani Z, Assistant Professor, Department of Artificial intelligence and machine learning, RNSIT_**. The objective of this project was to solve the real life problem of timetable scheduling and generate a timetable without manual effort using the proposed algorithm. The project was found to be useful to our department and can be used by other departments. It can also be extended for use by an entire university. It has achieved the goals we had set out to accomplish- mainly reducing manual effort and generating satisfactory timetable schedules for both students and faculty.
****
# Project Setup and Usage Guide

## How to Run the Project

1. **Create a Virtual Environment**
   ```bash
   python -m venv venv
2. **Activate the Virtual Environment**
- Windows
   ```bash
   venv\Scripts\activate
- macOS/Linux
   ```bash
   source venv/bin/activate
3. **Install Required Dependencies**
   ```bash
   pip install -r requirements.txt
4. **Run the Project**
   ```bash
   python ui_controller.py
****
## Database
**The default MongoDB settings are:**
   ```bash
   self.mongo_uri = "mongodb://localhost:27017/"
self.mongo_db_name = "timetable_db"
self.mongo_student_tt_collection_name = "student_timetables"
self.mongo_faculty_tt_collection_name = "timetable_teachers"
```
**You can modify these variables if you're connecting to a remote server or using different database/collection names.**
****
## Additional Information
- The application supports loading pre-saved input files.
- To use a sample input:
    - Select the Load option from the interface.
    - Choose the file: `RNSIT faculty assignment.json`