---
name: Prompt Engineering
description: Advanced techniques for crafting effective prompts for LLMs (GPT, Claude, etc.)
---

# Prompt Engineering Skill

## Core Principles

### 1. **Clarity & Specificity**

```
❌ Bad: "Write code"
✅ Good: "Write a TypeScript function that validates email format using regex"
```

### 2. **Context Provision**

```
You are an expert React developer. 
The codebase uses TypeScript, Zustand for state, and Tailwind CSS.
Task: Create a member list component with filtering.
```

### 3. **Output Format**

```
Return your response in JSON format:
{
  "solution": "...",
  "explanation": "...",
  "alternatives": []
}
```

## Prompting Techniques

### 1. **Few-Shot Learning**

```
Task: Classify sentiment

Example 1:
Input: "This product is amazing!"
Output: POSITIVE

Example 2:
Input: "Terrible experience"
Output: NEGATIVE

Now classify:
Input: "It's okay, nothing special"
Output:
```

### 2. **Chain of Thought**

```
Problem: Calculate 15% tip on $48.50

Let's think step by step:
1. Convert 15% to decimal: 0.15
2. Multiply: $48.50 × 0.15 = $7.275
3. Round to 2 decimals: $7.28

Answer: $7.28
```

### 3. **Role-Based Prompting**

```
You are a senior fitness trainer with 10 years of experience.
A client asks: "Should I do cardio before or after weights?"
Provide evidence-based advice.
```

## Advanced Patterns

### 1. **Structured Output**

```markdown
Generate a workout plan in this exact format:

# Week 1
## Monday: Push Day
- Exercise 1: [name] - [sets] x [reps]
- Exercise 2: ...

## Tuesday: Pull Day
...
```

### 2. **Constraint Specification**

```
Requirements:
- Use only exercises suitable for home
- No equipment needed
- Duration: 30 minutes max
- Difficulty: beginner
```

### 3. **Iterative Refinement**

```
First draft: [initial output]

Now improve by:
1. Adding specific weights
2. Including rest times
3. Adding progression notes
```

## Best Practices

### ✅ Do's

1. **Be specific**: Exact requirements
2. **Provide examples**: Show desired format
3. **Set constraints**: Limits and boundaries
4. **Iterate**: Refine prompts based on results
5. **Test variations**: A/B test prompts

### ❌ Don'ts

1. **Vague instructions**: "Make it better"
2. **Ambiguous terms**: "Professional looking"
3. **Missing context**: No background info
4. **Overcomplication**: Too many nested instructions

## Prompt Templates

### Code Generation

```
Language: [TypeScript/Python/etc]
Framework: [React/Vue/etc]
Task: [Specific functionality]
Requirements:
- [Requirement 1]
- [Requirement 2]
Constraints:
- [Constraint 1]
Output: [Code only / Code + explanation]
```

### Data Analysis

```
Dataset: [Description]
Goal: [Analysis objective]
Metrics: [What to calculate]
Visualization: [Chart types needed]
Format: [How to present results]
```

### Content Writing

```
Topic: [Subject matter]
Audience: [Target readers]
Tone: [Professional/Casual/Technical]
Length: [Word count]
Include: [Must-have points]
Avoid: [What not to mention]
```

## Evaluation

### Measuring Prompt Quality

1. **Accuracy**: Correct output?
2. **Relevance**: On-topic?
3. **Completeness**: All requirements met?
4. **Efficiency**: Tokens used vs. value gained

## Resources

- [OpenAI Prompt Engineering Guide](https://platform.openai.com/docs/guides/prompt-engineering)
- [Anthropic Claude Prompting](https://docs.anthropic.com/claude/docs/prompting)
- [PromptingGuide.ai](https://www.promptingguide.ai/)
