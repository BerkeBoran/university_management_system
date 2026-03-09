def check_prerequisites(student, target_course):
    requried_courses = target_course.prerequisites.all()

    if not requried_courses:
        return True, "Ön Koşul Yok"

    passed_courses = student.enrollments.filter().exclude(letter_grade = "ff").values_list('section__course__course_id', flat=True)

    for pre_course in requried_courses:
        if pre_course.course_id not in passed_courses:
            return False, f"Bu dersi almak için {pre_course.course_id} dersini alıp başarı ile geçmeniz lazım"

    return True ,"Ön koşullar sağlandı"