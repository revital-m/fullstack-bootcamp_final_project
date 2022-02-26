import React from "react";

function QuizSelectCategory({
  selectCategory,
  handleInputChange,
  isLoading,
  categoriesArray,
  setIsLoading,
  setIsShow,
  setErr,
  setQuizChosenCategory,
  getQuiz,
  setStudyingCategoryId,
  setQuizData,
  setIsStartQuiz,
  err,
}) {
  //* Create the categories options for the select element.
  const createOptions = () => {
    return categoriesArray.map((category) => {
      return (
        <option
          className="studying-card--info"
          key={category.categoryID}
          value={category.categoryID}
        >
          {category.categoryName}
        </option>
      );
    });
  };

  //* Get the quiz by the chosen category.
  const handleStartQuiz = async () => {
    setIsLoading(true);
    setIsShow(false);
    // addQuestionToQuiz(selectCategory);
    try {
      setErr("");
      if (selectCategory === "Select Category") {
        throw new Error("You must choose a category to start the quiz");
      }
      categoriesArray.forEach((category) => {
        if (category.categoryID === selectCategory) {
          setQuizChosenCategory(category.categoryName);
        }
      });
      const response = await getQuiz(selectCategory);
      setStudyingCategoryId(selectCategory);
      const shuffledQuiz = shuffle(response);
      shuffledQuiz.forEach(
        (item, idx) => (shuffledQuiz[idx].answers = shuffle(item.answers))
      );
      setQuizData(shuffledQuiz);
      setIsStartQuiz(true);
      setIsLoading(false);
      setIsShow(true);
    } catch (error) {
      setIsLoading(false);
      setErr(error.message);
      setIsShow(true);
    }
  };

  //* Shuffle the quiz answers & questions.
  const shuffle = (array) => {
    let currentIndex = array.length;
    let randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex != 0) {
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }

    return array;
  };

  return (
    <div className="quiz-container start-quiz">
      <div className="quiz__existing-category">
        {err && <p className="job-card--err">{err}</p>}
        <label className="quiz--label">
          Please select a category to start the quiz:
        </label>
        <select
          value={selectCategory}
          onChange={handleInputChange}
          name="selectCategory"
          className="quiz--info"
        >
          <option className="quiz--info" checked disabled>
            Select Category
          </option>
          {createOptions()}
        </select>
      </div>
      <button
        className="quiz--btn"
        disabled={isLoading}
        onClick={handleStartQuiz}
      >
        Start Quiz
      </button>
    </div>
  );
}

export default QuizSelectCategory;
