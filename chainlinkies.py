def terms(n,cache={}):
	if not n: return [(0, "")]

	upto = sum([terms(x) for x in range(n-1, 0, -1)], [])
	return [(c+1, '('+s+')') for c,s in termchain((0, ""), n-1, upto)]

def termchain(x, n, bb, start=0):
	if not n: return [x]

	out = []
	for i in range(start, len(bb)):
		c,s = bb[i]
		if c <= n: out += termchain((x[0] + c, x[1] + s), n-c, bb, i)
	return out

# Maybe this lessens eye strain. Maybe not.
#def replace_brackets(s):
#	depth,out = 0,[]
#	for c in s:
#		if c == '(':
#			out.append("123456"[depth%6])
#			depth += 1
#		else:
#			depth -= 1
#			out.append("123456"[depth%6])
#	return "".join(out)

print("Sys 0 Terms: 1")
for x in terms(1): print(x[1])
print("")
print("Sys 1 Terms: 1")
for x in terms(2): print(x[1])
print("")
print("Sys 2 Terms: 2")
for x in terms(3): print(x[1])
print("")
print("Sys 3 Terms: 4")
for x in terms(4): print(x[1])
print("")
print("Sys 4 Terms: 9")
for x in terms(5): print(x[1])
print("")
print("Sys 5 Terms: 20")
for x in terms(6): print(x[1])