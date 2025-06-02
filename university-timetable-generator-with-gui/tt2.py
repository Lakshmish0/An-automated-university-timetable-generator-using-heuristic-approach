import random
from data import * # Assuming data.py contains timetable class and other necessary data structures
from collections import deque
import os
import sys
import logging
import copy # Import copy for creating copies of timetables

# Assuming day_row_num, getfreeslots, getnumhours, is_consecutive_hour,
# print_timetable, finalize_lab, finalize_theory, finalize_elective,
# free_faculty, print_dayclash are defined as in the original code.
# The genetic algorithm will replace the core generation and adjustment logic.

# --- Genetic Algorithm Components ---

def finalize_elective(section, day, time, subjects, sub_short):
	global faculty
	section[day][time] = ('Elective', 0, 'Elective staff', sub_short) # last field is the one that matters, others are not used
	section.final[day][time] = True
	for sub in subjects:
		teacher = sub[2]
		if isinstance(teacher, list): # if elective is a lab, it may have multiple teachers
			for t in teacher:
				faculty[t][day][time] = (section.name, sub)
				faculty[t].final[day][time] = True
		else:
			faculty[teacher][day][time] = (section.name, sub)
			faculty[teacher].final[day][time] = True


def finalize_lab(section, day, time, subject, hours = 3):
	global faculty
	for i in range(time, time+hours): 
		section[day][i] = subject
		section.final[day][i] = True
		for teacher in subject[2]:
			faculty[teacher][day][i] = (section.name, subject)
			faculty[teacher].final[day][i] = True


def create_random_timetable(ui, subjects_ref, faculty):
    """
    Creates a single, potentially invalid, random timetable for the genetic algorithm.
    This function needs to be implemented based on how timetables are structured.
    It should attempt to assign subjects to slots randomly while respecting
    some basic constraints like fixed slots.
    """
    # Initialize timetables and faculty schedules
    timetables = OrderedDict()
    faculty_schedules = dict()

    for member in ui.faculty_list_value:
        faculty_schedules[member] = timetable(str(member))
        faculty_schedules[member].dept = ui.department

    for sem in ui.num_sections:
        if ui.num_sections[sem] > 0:
            timetables[sem] = OrderedDict()
            for section_name in ui.sections[sem]:
                timetables[sem][section_name] = timetable(sem + ' ' + section_name)
                timetables[sem][section_name].dept = ui.department

    # Apply fixed slots (these must be respected in all initial solutions)
    for sem in ui.section_fixed_slots:
        for section_name in ui.section_fixed_slots[sem]:
            section_tt = timetables[sem][section_name]
            for row in ui.section_fixed_slots[sem][section_name]:
                for col in ui.section_fixed_slots[sem][section_name][row]:
                    sub_short_list = ui.section_fixed_slots[sem][section_name][row][col]
                    day = ('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday')[row]
                    hour = col + 1
                    if sub_short_list == '-':
                        section_tt.final[day][hour] = True # Mark as unavailable/empty fixed slot
                    else:
                        # Assuming sub_short_list is a string like 'SUB1/SUB2' or 'SUB1'
                        sub_shorts = sub_short_list.split('/')
                        if len(sub_shorts) > 1: # Elective
                             # Need to retrieve the actual subject objects for the elective
                            elective_subjects = [subjects_ref[sem][section_name][s] for s in sub_shorts if s in subjects_ref[sem][section_name]]
                            finalize_elective(section_tt, day, hour, elective_subjects, sub_short_list)
                        else: # Not elective
                            short = sub_shorts[0]
                            if short in subjects_ref[sem][section_name]:
                                sub = subjects_ref[sem][section_name][short]
                                if ui.subs[short].lab: # Assuming ui.subs contains details like lab status
                                    finalize_lab(section_tt, day, hour, sub, 1) # Assuming 1 hour is marked as final for labs here, adjust if labs are finalized as a block
                                else:
                                    finalize_theory(section_tt, day, hour, sub, 1)


    # Apply faculty fixed slots
    for staff in ui.faculty_fixed_slots:
        if staff in faculty_schedules:
            for row in ui.faculty_fixed_fixed_slots[staff]:
                for column in ui.faculty_fixed_slots[staff][row]:
                    day = ('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday')[row]
                    hour = column + 1
                    free_faculty(faculty_schedules[staff], hour, day) # Mark faculty as unavailable

    # --- Random Assignment Logic (Needs detailed implementation) ---
    # This part is crucial and depends heavily on your timetable/subject structure.
    # You need to iterate through subjects and try to place them randomly
    # in available slots, respecting fixed slots and total hour requirements.
    # This initial placement will likely result in many conflicts.

    # Example (simplified - needs refinement):
    all_possible_slots = []
    for sem in timetables:
        for section_name, section_tt in timetables[sem].items():
            for day in section_tt:
                for timeslot in section_tt[day]:
                     # Only consider slots that are not already finalized
                    if not section_tt.final[day][timeslot]:
                         all_possible_slots.append((sem, section_name, day, timeslot))

    random.shuffle(all_possible_slots)

    # Create a list of subjects to be scheduled, considering required hours
    subjects_to_schedule = []
    for sem in ui.subjects_assigned:
        for section_name in ui.subjects_assigned[sem]:
            for sub_str in ui.subjects_assigned[sem][section_name]:
                sub_long, sub_short, staff_str = sub_str.split(' - ')
                staff = staff_str.split(', ')
                sub_details = ui.subs[sub_short]
                # Determine the teacher(s) - assuming single teacher for theory, list for lab
                assigned_staff = staff[0] if not sub_details.lab else staff
                s = [sub_long, sub_details.credits, assigned_staff, sub_short]
                # Add the subject to the list based on its credits/hours
                for _ in range(sub_details.credits): # Assuming credits = hours
                     subjects_to_schedule.append((sem, section_name, s))

    # Attempt to randomly assign subjects to available slots
    # This is a very basic random assignment and will likely cause many clashes
    assigned_count = {}
    for sem, section_name, subject in subjects_to_schedule:
        subject_key = (sem, section_name, subject[3]) # Use short name as key
        if subject_key not in assigned_count:
            assigned_count[subject_key] = 0

        # Find a random available slot for this subject
        available_slots_for_subject = [
            (s, sec, d, t) for s, sec, d, t in all_possible_slots
            if s == sem and sec == section_name
            and not timetables[s][sec].final[d][t] # Slot is not finalized
            # Add checks here for teacher availability if possible in initial random placement
            # and if the subject hasn't exceeded its daily limit if applicable
        ]
        if available_slots_for_subject and assigned_count[subject_key] < subject[1]: # Check if hours needed
            chosen_slot = random.choice(available_slots_for_subject)
            sem_chosen, section_chosen, day_chosen, timeslot_chosen = chosen_slot

            # Assign the subject to the chosen slot
            timetables[sem_chosen][section_chosen][day_chosen][timeslot_chosen] = subject
            assigned_count[subject_key] += 1
            # Update faculty schedule (this will likely cause clashes initially)
            teacher = subject[2]
            if isinstance(teacher, list): # Lab with multiple teachers
                for t in teacher:
                    if t in faculty_schedules:
                        faculty_schedules[t][day_chosen][timeslot_chosen] = (section_chosen, subject)
            else: # Theory with single teacher
                 if teacher in faculty_schedules:
                    faculty_schedules[teacher][day_chosen][timeslot_chosen] = (section_chosen, subject)

            # Remove the slot from the list of available slots to avoid re-using it
            # This is a simplification; a real implementation might need a more robust way
            # to track used slots and handle multi-hour subjects/labs.
            if chosen_slot in all_possible_slots:
                all_possible_slots.remove(chosen_slot)


    # The returned chromosome is the set of generated timetables and faculty schedules
    return {'timetables': timetables, 'faculty': faculty_schedules}


def finalize_theory(section, day, time, subject, hours = 1):
	global faculty
	for i in range(time, time+hours):
		section[day][i] = subject
		section.final[day][i] = True
		teacher = subject[2]
		faculty[teacher][day][i] = (section.name, subject)
		faculty[teacher].final[day][i] = True


def free_faculty(teacher, time, day = 'all'):
	if day == 'all':
		for day in 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday':
			if time == 'all':
				for i in range(1, 8+1):
					if i in teacher.final[day]:
						teacher.final[day][i] = True
			else:
				teacher.final[day][time] = True
	else:
		if time == 'all':
			for i in range(1, 8+1):
				if i in teacher.final[day]:
					teacher.final[day][i] = True
		else:
			teacher.final[day][time] = True


def is_consecutive_hour(teacher, d, h):
	previous = teacher[d][h-1] if h > 1 else None
	if (d == 'saturday' and h < 4) or (d != 'saturday' and h < 8):
		next = teacher[d][h+1]
	else:
		next = None
	if not previous and not next:
		return False
	elif previous and next:
		return True
	elif previous and h == 3:
		return False
	elif next and h == 2:
		return False
	else:
		return True


def calculate_fitness(chromosome, ui, subjects_ref):
    """
    Calculates the fitness score of a timetable (chromosome).
    Higher score means a better timetable.
    This function needs to be implemented based on your constraints.
    """
    timetables = chromosome['timetables']
    faculty_schedules = chromosome['faculty']
    fitness = 0
    hard_constraint_penalty = 1000 # Penalty for violating a hard constraint
    soft_constraint_penalty = 10 # Penalty for violating a soft constraint

    # --- Hard Constraints ---

    # 1. Section Clashes: A section cannot have two subjects at the same time.
    # This should ideally be prevented by the chromosome representation or initial generation,
    # but can be checked here.
    for sem in timetables:
        for section_name, section_tt in timetables[sem].items():
            for day in section_tt:
                scheduled_slots = {}
                for timeslot, subject in section_tt[day].items():
                    if subject != '':
                        if timeslot in scheduled_slots:
                            fitness -= hard_constraint_penalty # Clash detected
                        scheduled_slots[timeslot] = subject

    # 2. Teacher Clashes: A teacher cannot teach two classes at the same time.
    for teacher_name, teacher_tt in faculty_schedules.items():
        for day in teacher_tt:
            scheduled_slots = {}
            for timeslot, assignment in teacher_tt[day].items():
                if assignment != '':
                    if timeslot in scheduled_slots:
                        fitness -= hard_constraint_penalty # Clash detected
                    scheduled_slots[timeslot] = assignment

    # 3. Required Hours: Each subject assigned exactly its required hours.
    # This is complex to check precisely here without knowing initial requirements vs assigned.
    # A better approach is to ensure genetic operators maintain hour counts.
    # As a simplified check, you could penalize if a subject appears more times than its credits.
    subject_counts = {}
    for sem in timetables:
        for section_name, section_tt in timetables[sem].items():
            for day in section_tt:
                for timeslot, subject in section_tt[day].items():
                    if subject != '':
                        subject_key = (sem, section_name, subject[3]) # (sem, section, short_name)
                        if subject_key not in subject_counts:
                            subject_counts[subject_key] = 0
                        subject_counts[subject_key] += 1

    for sem in ui.subjects_assigned:
        for section_name in ui.subjects_assigned[sem]:
            for sub_str in ui.subjects_assigned[sem][section_name]:
                sub_long, sub_short, staff_str = sub_str.split(' - ')
                sub_details = ui.subs[sub_short]
                subject_key = (sem, section_name, sub_short)
                assigned_hours = subject_counts.get(subject_key, 0)
                required_hours = sub_details.credits # Assuming credits = hours
                if assigned_hours != required_hours:
                     # Penalize deviation from required hours
                    fitness -= hard_constraint_penalty * abs(assigned_hours - required_hours)


    # 4. Fixed Slots Respected: Assignments in 'final' slots match the fixed assignments.
    # This should ideally be handled by ensuring genetic operators don't alter 'final' slots.
    # You could add a check here to penalize if a 'final' slot is changed.
    # (Skipping detailed implementation here, assume operators handle this)


    # --- Soft Constraints ---

    # 1. Minimize Gaps in Section Schedules
    for sem in timetables:
        for section_name, section_tt in timetables[sem].items():
            for day in section_tt:
                scheduled_times = sorted([ts for ts, sub in section_tt[day].items() if sub != ''])
                if len(scheduled_times) > 1:
                    for i in range(len(scheduled_times) - 1):
                        # Calculate gaps between consecutive classes
                        gap = scheduled_times[i+1] - scheduled_times[i] - 1
                        if gap > 0:
                            fitness -= soft_constraint_penalty * gap # Penalize each gap hour

    # 2. Distribute Subject Hours Evenly (e.g., avoid scheduling all hours of a subject on one day)
    # This requires tracking daily hours for each subject and penalizing uneven distribution.
    # (Skipping detailed implementation here)

    # 3. Minimize Consecutive Hours for Teachers (using is_consecutive_hour)
    for teacher_name, teacher_tt in faculty_schedules.items():
        for day in teacher_tt:
            for timeslot in teacher_tt[day]:
                if teacher_tt[day][timeslot] != '' and is_consecutive_hour(teacher_tt, day, timeslot):
                     # This check might need refinement based on how is_consecutive_hour works
                     # and if consecutive hours are always bad or only beyond a certain limit.
                    pass # Adjust penalty based on your policy for consecutive hours


    # Add more soft constraints as needed (e.g., room capacity, preferred rooms, etc.)

    return fitness

def select_parents(population, num_parents):
    """
    Selects parent chromosomes from the population based on fitness.
    Implemented using Tournament Selection.
    """
    parents = []
    population_size = len(population)
    tournament_size = 5 # Number of individuals in each tournament

    for _ in range(num_parents):
        tournament_contestants = random.sample(population, tournament_size)
        # Select the fittest individual from the tournament
        fittest_contestant = max(tournament_contestants, key=lambda x: x['fitness'])
        parents.append(fittest_contestant['chromosome'])

    return parents

def crossover(parent1_chromosome, parent2_chromosome, crossover_rate):
    """
    Combines two parent chromosomes to create offspring.
    Implemented using a simplified crossover that swaps schedules for random sections.
    Needs more sophisticated logic to maintain validity and structure.
    """
    if random.random() < crossover_rate:
        # Create copies to avoid modifying parents
        child1_chromosome = copy.deepcopy(parent1_chromosome)
        child2_chromosome = copy.deepcopy(parent2_chromosome)

        # Get lists of semesters and sections
        semesters = list(child1_chromosome['timetables'].keys())
        if not semesters:
             return child1_chromosome, child2_chromosome # No sections to crossover

        # Choose a random semester to crossover
        crossover_sem = random.choice(semesters)
        sections_in_sem = list(child1_chromosome['timetables'][crossover_sem].keys())

        if not sections_in_sem:
             return child1_chromosome, child2_chromosome # No sections in this semester

        # Choose a random subset of sections to swap schedules for
        num_sections_to_swap = random.randint(1, len(sections_in_sem))
        sections_to_swap = random.sample(sections_in_sem, num_sections_to_swap)

        # Swap the schedules for the selected sections and corresponding faculty assignments
        for section_name in sections_to_swap:
            # Swap section timetables
            child1_chromosome['timetables'][crossover_sem][section_name], \
            child2_chromosome['timetables'][crossover_sem][section_name] = \
            child2_chromosome['timetables'][crossover_sem][section_name], \
            child1_chromosome['timetables'][crossover_sem][section_name]

            # This simple swap will likely break faculty schedules.
            # A more advanced crossover would need to re-evaluate and adjust
            # faculty schedules based on the swapped section schedules, or
            # perform crossover at a more granular level (e.g., per day or per slot).
            # Re-calculating faculty schedules based on the new section schedules is one approach,
            # but can be computationally expensive and might reintroduce many conflicts.
            # A better approach might be to swap corresponding faculty assignments
            # along with the section assignments, but this is complex.

            # For this example, we'll just note that faculty schedules will be inconsistent
            # after this simple section-based swap and the fitness function will penalize this.
            # A real implementation needs a more sophisticated crossover.


        return child1_chromosome, child2_chromosome
    else:
        return copy.deepcopy(parent1_chromosome), copy.deepcopy(parent2_chromosome) # Return copies if no crossover


def mutate(chromosome, mutation_rate, ui, subjects_ref, faculty_list):
    """
    Introduces random changes in a chromosome.
    Implemented using a simplified mutation that randomly moves a subject.
    Needs more sophisticated logic to maintain validity and structure.
    """
    mutated_chromosome = copy.deepcopy(chromosome)
    timetables = mutated_chromosome['timetables']
    faculty_schedules = mutated_chromosome['faculty']

    if random.random() < mutation_rate:
        # Get a list of all scheduled slots that are NOT finalized
        schedulable_slots = []
        for sem in timetables:
            for section_name, section_tt in timetables[sem].items():
                for day in section_tt:
                    for timeslot, subject in section_tt[day].items():
                        if subject != '' and not section_tt.final[day][timeslot]:
                             schedulable_slots.append((sem, section_name, day, timeslot, subject))

        if not schedulable_slots:
             return mutated_chromosome # Nothing to mutate

        # Choose a random scheduled slot to mutate
        sem_old, section_old, day_old, timeslot_old, subject_to_move = random.choice(schedulable_slots)

        # Find a random *different* available slot that is NOT finalized
        available_slots = []
        for sem in timetables:
            for section_name, section_tt in timetables[sem].items():
                for day in section_tt:
                    for timeslot in section_tt[day]:
                        # Slot must be empty and not finalized
                        if section_tt[day][timeslot] == '' and not section_tt.final[day][timeslot]:
                             # Ensure it's not the original slot
                            if not (sem == sem_old and section_name == section_old and day == day_old and timeslot == timeslot_old):
                                # Add checks here for teacher availability at the new slot
                                # and if moving the subject is otherwise valid
                                available_slots.append((sem, section_name, day, timeslot))

        if not available_slots:
             return mutated_chromosome # No place to move the subject

        # Choose a random new slot
        sem_new, section_new, day_new, timeslot_new = random.choice(available_slots)

        # --- Perform the mutation (move the subject) ---

        # Clear the old slot in the section timetable
        mutated_chromosome['timetables'][sem_old][section_old][day_old][timeslot_old] = ''

        # Assign the subject to the new slot in the section timetable
        mutated_chromosome['timetables'][sem_new][section_new][day_new][timeslot_new] = subject_to_move

        # --- Update Faculty Schedules (Crucial and complex) ---
        # This is the most challenging part of mutation for timetables.
        # Simply moving the subject in the section timetable will make the faculty
        # schedules inconsistent. You need to update the faculty schedules accordingly.

        # Remove from old faculty slot
        teacher = subject_to_move[2]
        if isinstance(teacher, list): # Lab
            for t in teacher:
                if t in faculty_schedules:
                    # Need to find the specific assignment to remove, not just clear the slot
                    # This requires faculty schedule entries to include section info.
                    # Assuming faculty_schedules[t][day][timeslot] is (section_name, subject)
                    if faculty_schedules[t][day_old][timeslot_old] == (section_old, subject_to_move):
                         faculty_schedules[t][day_old][timeslot_old] = ''
        else: # Theory
            if teacher in faculty_schedules:
                 if faculty_schedules[teacher][day_old][timeslot_old] == (section_old, subject_to_move):
                    faculty_schedules[teacher][day_old][timeslot_old] = ''

        # Add to new faculty slot
        if isinstance(teacher, list): # Lab
            for t in teacher:
                if t in faculty_schedules:
                    # Check if the new faculty slot is available before assigning
                    if faculty_schedules[t][day_new][timeslot_new] == '' and not faculty_schedules[t].final[day_new][timeslot_new]:
                        faculty_schedules[t][day_new][timeslot_new] = (section_new, subject_to_move)
                    else:
                        # If the new faculty slot is not available, this mutation is invalid
                        # You might need to revert the mutation or penalize heavily in fitness.
                        # For simplicity in this example, we'll just assign and let fitness handle it.
                         faculty_schedules[t][day_new][timeslot_new] = (section_new, subject_to_move)
        else: # Theory
            if teacher in faculty_schedules:
                 if faculty_schedules[teacher][day_new][timeslot_new] == '' and not faculty_schedules[teacher].final[day_new][timeslot_new]:
                    faculty_schedules[teacher][day_new][timeslot_new] = (section_new, subject_to_move)
                 else:
                     # If the new faculty slot is not available, this mutation is invalid
                     # You might need to revert the mutation or penalize heavily in fitness.
                     # For simplicity in this example, we'll just assign and let fitness handle it.
                    faculty_schedules[teacher][day_new][timeslot_new] = (section_new, subject_to_move)


    return mutated_chromosome

# --- Main Genetic Algorithm Function ---

def produce_timetable_ga(ui, loc):
    location = loc
    logger = logging.getLogger('tt_algo_ga')
    logging.basicConfig(filename=location, level=logging.INFO)
    logger.info('')

    # Initialize data structures based on UI input
    faculty_list = ui.faculty_list_value
    subjects_data = ui.subs # Assuming ui.subs contains subject details
    subjects_assigned_data = ui.subjects_assigned # Assuming ui.subjects_assigned links subjects to sections
    section_fixed_slots_data = ui.section_fixed_slots
    faculty_fixed_slots_data = ui.faculty_fixed_slots

    # Prepare subjects_ref for easy lookup
    subjects_ref = dict()
    for sem in ui.subjects_assigned:
        subjects_ref[sem] = dict()
        for section in ui.subjects_assigned[sem]:
            subjects_ref[sem][section] = dict()
            for sub_str in ui.subjects_assigned[sem][section]:
                 sub_long, sub_short, staff_str = sub_str.split(' - ')
                 staff = staff_str.split(', ')
                 sub_details = ui.subs[sub_short]
                 assigned_staff = staff[0] if not sub_details.lab else staff
                 s = [sub_long, sub_details.credits, assigned_staff, sub_short]
                 subjects_ref[sem][section][sub_short] = s


    # Genetic Algorithm Parameters
    population_size = 50
    num_generations = 1000
    crossover_rate = 0.8
    mutation_rate = 0.1
    num_parents = population_size // 2 # Number of parents to select for reproduction
    num_offspring = population_size - num_parents # Number of offspring to create

    # 1. Initialization: Create the initial population
    logger.info("Initializing population...")
    population = []
    for _ in range(population_size):
        chromosome = create_random_timetable(ui, subjects_ref, faculty_list)
        fitness = calculate_fitness(chromosome, ui, subjects_ref)
        population.append({'chromosome': chromosome, 'fitness': fitness})
    logger.info("Population initialized.")

    # Sort population by fitness (descending)
    population.sort(key=lambda x: x['fitness'], reverse=True)

    # Genetic Algorithm Loop
    logger.info("Starting genetic algorithm...")
    for generation in range(num_generations):
        logger.info(f"Generation {generation + 1}/{num_generations}, Best Fitness: {population[0]['fitness']}")

        # 2. Selection: Select parents for the next generation
        parents_chromosomes = select_parents(population, num_parents)

        # Create the next generation population (start with the best parents - elitism)
        next_population = population[:num_parents] # Keep the top parents

        # 3. Crossover and 4. Mutation: Create offspring
        offspring_chromosomes = []
        for i in range(0, num_parents, 2):
            if i + 1 < num_parents:
                parent1 = parents_chromosomes[i]
                parent2 = parents_chromosomes[i+1]
                child1, child2 = crossover(parent1, parent2, crossover_rate)
                offspring_chromosomes.append(mutate(child1, mutation_rate, ui, subjects_ref, faculty_list))
                offspring_chromosomes.append(mutate(child2, mutation_rate, ui, subjects_ref, faculty_list))
            elif i < num_parents: # Handle odd number of parents
                 offspring_chromosomes.append(mutate(copy.deepcopy(parents_chromosomes[i]), mutation_rate, ui, subjects_ref, faculty_list))


        # 5. Evaluation: Calculate fitness for offspring
        offspring_population = []
        for chromosome in offspring_chromosomes:
            fitness = calculate_fitness(chromosome, ui, subjects_ref)
            offspring_population.append({'chromosome': chromosome, 'fitness': fitness})

        # 6. Replacement: Form the new population
        # Combine parents and offspring and select the fittest for the next generation
        combined_population = next_population + offspring_population
        combined_population.sort(key=lambda x: x['fitness'], reverse=True)
        population = combined_population[:population_size] # Select the top individuals

        # Termination condition (optional): Stop if a satisfactory fitness is reached
        # if population[0]['fitness'] >= target_fitness: # Define a target_fitness
        #     logger.info("Target fitness reached. Terminating.")
        #     break

    logger.info("Genetic algorithm finished.")

    # Get the best timetable from the final population
    best_chromosome = population[0]['chromosome']
    final_timetables = best_chromosome['timetables']
    final_faculty_schedules = best_chromosome['faculty']

    # You might want to run a final local optimization or repair on the best timetable
    # to fix any minor hard constraint violations that might still exist.

    # Print the final timetables
    logger.info("\n--- Final Timetables (Genetic Algorithm) ---")
    for sem in final_timetables:
        for section_name, section_tt in final_timetables[sem].items():
            print_timetable(section_tt, location)

    logger.info("\n--- Final Faculty Schedules (Genetic Algorithm) ---")
    for teacher_name, teacher_tt in final_faculty_schedules.items():
         # Assuming faculty timetable object has a name attribute
        print_timetable(teacher_tt, location, style='staff', name=teacher_name)


    # Note: The dayclash and clash queues are not directly used in this GA structure
    # as the GA handles conflicts through the fitness function and genetic operators.
    # You might still want to identify and report any remaining clashes in the final timetable.
    remaining_dayclash = deque() # Or identify clashes in the best timetable

    return final_timetables, final_faculty_schedules, remaining_dayclash

# Example usage (assuming ui object and location are defined elsewhere):
# timetables, faculty, dayclash = produce_timetable_ga(ui, 'timetable_log_ga.txt')

def print_timetable(tt, location, style = 'section', name = ''):
	logger = logging.getLogger('tt_algo')
	logging.basicConfig(filename = location, level = logging.DEBUG)
	if name == '':
		name = tt.name
	logger.info(('%-20s ' * 9) % (name, '9:00-9:55', '9:55-10:50', '11:10-12:05', '12:05-1:00', '1:00-1:55', '1:55-2:50', '2:50-3:40', '3:40-4:30'))
	for day in tt:
		x = '%-20s' % day
		for timeslot in tt[day]:
			if tt[day][timeslot] == '':
				x += ' ' + '%-20s' % '-'
			else:

				if style == 'section':
					x += ' ' + '%-20s' % tt[day][timeslot][3]
				else:
					section = tt[day][timeslot][0]
					subject = tt[day][timeslot][1][3]
					x += ' ' + '%-20s' % (subject + ' (' + section + ')')
		logger.info('%s', x)
	logger.info('\n')