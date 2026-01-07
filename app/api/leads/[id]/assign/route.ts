import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/config/database';
import { getCurrentUser } from '@/lib/utils/auth';

// PATCH /api/leads/[id]/assign - Assign lead to sales team member
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getCurrentUser(request);

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if user is admin
    if (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Forbidden - Admin access required' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { assignedToId, priority, notes } = body;

    // Check if lead exists
    const lead = await prisma.lead.findUnique({
      where: { id },
    });

    if (!lead) {
      return NextResponse.json(
        { success: false, error: 'Lead not found' },
        { status: 404 }
      );
    }

    // If assignedToId is provided, verify the user exists and is a sales team member
    if (assignedToId) {
      const assignedUser = await prisma.user.findUnique({
        where: { id: assignedToId },
        select: { id: true, fullName: true, role: true },
      });

      if (!assignedUser) {
        return NextResponse.json(
          { success: false, error: 'Assigned user not found' },
          { status: 404 }
        );
      }

      // Check if user is a sales team member
      const salesRoles = ['INTERNAL_SALES', 'DEALER', 'DISTRIBUTOR', 'ADMIN', 'SUPER_ADMIN'];
      if (!salesRoles.includes(assignedUser.role)) {
        return NextResponse.json(
          { success: false, error: 'User is not a sales team member' },
          { status: 400 }
        );
      }
    }

    // Update lead
    const updateData: any = {};
    if (assignedToId !== undefined) {
      updateData.assignedToId = assignedToId || null;
      updateData.assignedAt = assignedToId ? new Date() : null;
    }
    if (priority) {
      updateData.priority = priority;
    }
    if (notes !== undefined) {
      updateData.notes = notes;
    }

    const updatedLead = await prisma.lead.update({
      where: { id },
      data: updateData,
      include: {
        property: {
          select: {
            id: true,
            title: true,
            slug: true,
            price: true,
            city: true,
            state: true,
          },
        },
        assignedTo: {
          select: {
            id: true,
            fullName: true,
            email: true,
            role: true,
          },
        },
      },
    });

    // Create activity log
    await prisma.leadActivity.create({
      data: {
        leadId: id,
        userId: user.userId,
        activityType: 'LEAD_ASSIGNED',
        title: assignedToId
          ? `Lead assigned to ${updatedLead.assignedTo?.fullName || 'sales team'}`
          : 'Lead assignment removed',
        description: assignedToId
          ? `Lead assigned to ${updatedLead.assignedTo?.fullName || 'sales team member'}`
          : 'Lead assignment removed',
        metadata: {
          assignedToId: assignedToId || null,
          assignedBy: user.userId,
          priority: priority || updatedLead.priority,
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Lead assigned successfully',
      lead: updatedLead,
    });
  } catch (error: any) {
    console.error('Error assigning lead:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to assign lead',
      },
      { status: 500 }
    );
  }
}

