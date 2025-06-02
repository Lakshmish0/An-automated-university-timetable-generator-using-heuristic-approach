from collections import OrderedDict

def convert_timetable_to_mongodb_docs(timetable_data):
    
    mongodb_documents = []
    
    for day_schedule_tuple in timetable_data:
        day_name = day_schedule_tuple[0]
        periods_data = day_schedule_tuple[1] # This can be an OrderedDict or a dict
        
        day_document = {
            "day": day_name,
            "schedule": []
        }
        
        sorted_periods = sorted(periods_data.items())

        for period_number, class_info in sorted_periods:
            period_entry = {
                "period": period_number,
                "class_details": None  # Default to None if no class
            }
            
            if isinstance(class_info, tuple) and len(class_info) == 2:
                class_name_val, details_list = class_info
                
                if isinstance(details_list, list) and len(details_list) == 4:
                    subject_name, semester, faculty_name, subject_code = details_list
                    period_entry["class_details"] = {
                        "className": class_name_val,
                        "subjectName": subject_name,
                        "semester": semester,
                        "facultyName": faculty_name,
                        "subjectCode": subject_code
                    }
            
            day_document["schedule"].append(period_entry)
        
        mongodb_documents.append(day_document)
        
    return mongodb_documents

# --- Example Usage with your provided data ---
if __name__ == '__main__':
    # Input data (as provided in the question)
    print(timetable_input = [('monday', OrderedDict([(1, ''), (2, ('III B', ['Data Structures and its Applications', 6, 'Andhe Pallavi', 'DSA'])), (3, ''), (4, ('V A', ['Principles of Artificial Intelligence', 5, 'Andhe Pallavi', 'PAI'])), (5, ''), (6, ''), (7, ''), (8, '')])), ('tuesday', OrderedDict([(1, ('III B', ['Data Structures and its Applications', 6, 'Andhe Pallavi', 'DSA'])), (2, ''), (3, ''), (4, ''), (5, ''), (6, ''), (7, ''), (8, ('V A', ['Principles of Artificial Intelligence', 5, 'Andhe Pallavi', 'PAI']))])), ('wednesday', OrderedDict([(1, ''), (2, ('V A', ['Principles of Artificial Intelligence', 5, 'Andhe Pallavi', 'PAI'])), (3, ''), (4, ''), (5, ''), (6, ''), (7, ('III B', ['Data Structures and its Applications', 6, 'Andhe Pallavi', 'DSA'])), (8, '')])), ('thursday', OrderedDict([(1, ('V A', ['Principles of Artificial Intelligence', 5, 'Andhe Pallavi', 'PAI'])), (2, ''), (3, ('III B', ['Data Structures and its Applications', 6, 'Andhe Pallavi', 'DSA'])), (4, ''), (5, ''), (6, ''), (7, ''), (8, '')])), ('friday', OrderedDict([(1, ''), (2, ''), (3, ''), (4, ''), (5, ''), (6, ''), (7, ('III B', ['Data Structures and its Applications', 6, 'Andhe Pallavi', 'DSA'])), (8, '')])), ('saturday', {1: ('III B', ['Data Structures and its Applications', 6, 'Andhe Pallavi', 'DSA']), 2: '', 3: ('V A', ['Principles of Artificial Intelligence', 5, 'Andhe Pallavi', 'PAI']), 4: ''})]
)