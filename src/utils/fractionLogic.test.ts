import test from 'node:test';
import assert from 'node:assert/strict';
import {
  gcd,
  lcm,
  simplifyFraction,
  compareFractions,
  addFractions,
  subtractFractions,
  isSortedAscending,
  calculateScore,
} from './fractionLogic.ts';

test('gcd calculates greatest common divisor correctly', () => {
  assert.equal(gcd(6, 9), 3);
  assert.equal(gcd(12, 18), 6);
  assert.equal(gcd(7, 13), 1);
  assert.equal(gcd(8, 8), 8);
});

test('lcm calculates least common multiple correctly', () => {
  assert.equal(lcm(3, 4), 12);
  assert.equal(lcm(4, 6), 12);
  assert.equal(lcm(5, 10), 10);
  assert.equal(lcm(7, 5), 35);
});

test('simplifyFraction simplifies to lowest terms', () => {
  assert.deepEqual(simplifyFraction({ num: 4, den: 8 }), { num: 1, den: 2 });
  assert.deepEqual(simplifyFraction({ num: 3, den: 9 }), { num: 1, den: 3 });
  assert.deepEqual(simplifyFraction({ num: 5, den: 7 }), { num: 5, den: 7 });
  assert.deepEqual(simplifyFraction({ num: 6, den: 4 }), { num: 3, den: 2 });
});

test('compareFractions returns correct comparison symbol', () => {
  assert.equal(compareFractions({ num: 1, den: 2 }, { num: 3, den: 4 }), '<');
  assert.equal(compareFractions({ num: 3, den: 4 }, { num: 2, den: 3 }), '>');
  assert.equal(compareFractions({ num: 2, den: 4 }, { num: 1, den: 2 }), '=');
});

test('addFractions handles same and different denominators with steps', () => {
  // Same denominator: 2/7 + 3/7 = 5/7
  const r1 = addFractions({ num: 2, den: 7 }, { num: 3, den: 7 });
  assert.equal(r1.isSameDen, true);
  assert.equal(r1.resultNum, 5);
  assert.equal(r1.resultDen, 7);

  // Different denominators: 1/3 + 1/4 = 7/12
  const r2 = addFractions({ num: 1, den: 3 }, { num: 1, den: 4 });
  assert.equal(r2.isSameDen, false);
  assert.equal(r2.commonDen, 12);
  assert.equal(r2.resultNum, 7);
  assert.equal(r2.resultDen, 12);
  assert.equal(r2.steps.length > 2, true);
});

test('subtractFractions handles same and different denominators', () => {
  // Same denominator: 5/8 - 2/8 = 3/8
  const s1 = subtractFractions({ num: 5, den: 8 }, { num: 2, den: 8 });
  assert.equal(s1.resultNum, 3);
  assert.equal(s1.resultDen, 8);

  // Different denominators: 5/6 - 1/3 = 5/6 - 2/6 = 3/6 = 1/2
  const s2 = subtractFractions({ num: 5, den: 6 }, { num: 1, den: 3 });
  assert.equal(s2.simplified.num, 1);
  assert.equal(s2.simplified.den, 2);
});

test('isSortedAscending correctly detects ordered list', () => {
  assert.equal(
    isSortedAscending([
      { num: 1, den: 4 },
      { num: 1, den: 2 },
      { num: 3, den: 4 },
    ]),
    true
  );

  assert.equal(
    isSortedAscending([
      { num: 3, den: 4 },
      { num: 1, den: 2 },
      { num: 1, den: 4 },
    ]),
    false
  );
});

test('calculateScore calculates score and stars accurately', () => {
  assert.deepEqual(calculateScore(20, 20), { score: 100, stars: 3 });
  assert.deepEqual(calculateScore(16, 20), { score: 80, stars: 3 });
  assert.deepEqual(calculateScore(12, 20), { score: 60, stars: 2 });
  assert.deepEqual(calculateScore(5, 20), { score: 25, stars: 1 });
});

test('QUIZ_BANK has at least 20 questions with complete data', async () => {
  const { QUIZ_BANK } = await import('./fractionLogic.ts');
  assert.equal(QUIZ_BANK.length >= 20, true, 'QUIZ_BANK must have at least 20 questions');
  QUIZ_BANK.forEach((q) => {
    assert.equal(typeof q.id, 'number');
    assert.equal(typeof q.question, 'string');
    assert.equal(q.question.length > 5, true);
    assert.equal(typeof q.correctAnswer, 'string');
    if (q.type === 'multiple-choice') {
      assert.equal(Array.isArray(q.options), true);
      assert.equal((q.options?.length || 0) >= 3, true);
      assert.equal(q.options?.includes(q.correctAnswer), true, `Question ${q.id} correct answer must be in options`);
    }
  });
});
